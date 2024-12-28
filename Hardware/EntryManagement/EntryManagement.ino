#include <WiFi.h>
#include <PubSubClient.h>
#include <ESP32Servo.h>
#include <LiquidCrystal_I2C.h>
#include <SPI.h>
#include <MFRC522.h>
#include <WiFiClientSecure.h>

#define RST_PIN 15    // Reset pin for RFID
#define SS_PIN 5      // Slave select pin for RFID
#define RST_PIN_2 16  // Reset pin for second RFID
#define SS_PIN_2 4    // Slave select pin for second RFID

// Wi-Fi and MQTT configuration
const char* ssid = "daphone";
const char* password = "bruhbrub";
const char* mqtt_server = "0011edc280a343e3af6bdd0526addb9e.s1.eu.hivemq.cloud";  // Change to your private MQTT broker IP/domain
const int mqtt_port = 8883;                                                       // Change if your broker uses a different port
const char* mqtt_user = "username1";                                              // Optional: Add if your broker requires authentication
const char* mqtt_password = "userPassword1";                                      // Optional: Add if your broker requires authentication

// Device information
const char* deviceId = "device01";
const char* status_topic = "device/device01/status";
const char* enter_topic = "barrier/enter/response/device01";
const char* exit_topic = "barrier/exit/response/device01";
const char* command_topic = "barrier/device01/command";
const char* lwt_topic = "device/device01/status";

// MQTT statuses
const char* online_status = "{\"status\": \"online\"}";
const char* offline_status = "{\"status\": \"offline\"}";

const int ledPin = 2;  // LED indicator
unsigned long previousMillis = 0;
const long interval = 5000;  // Publish interval for status updates
unsigned long lastDisplayTime = 0;
const long displayDuration = 2000;

bool isEntering = false;
bool isExiting = false;
unsigned long enterOpenTime = 0;
unsigned long exitOpenTime = 0;

// WiFiClient espClient;
// PubSubClient client(espClient);
Servo servoEnter;
Servo servoExit;
LiquidCrystal_I2C lcd(0x27, 16, 2);
MFRC522 mfrc522(SS_PIN, RST_PIN);
MFRC522 mfrc522Enter(SS_PIN_2, RST_PIN_2);

WiFiClientSecure espClient;
PubSubClient client(espClient);

String tagID;
String tagIDEnter;

static const char* root_ca PROGMEM = R"EOF(
-----BEGIN CERTIFICATE-----
MIIFBjCCAu6gAwIBAgIRAIp9PhPWLzDvI4a9KQdrNPgwDQYJKoZIhvcNAQELBQAw
TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh
cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMjQwMzEzMDAwMDAw
WhcNMjcwMzEyMjM1OTU5WjAzMQswCQYDVQQGEwJVUzEWMBQGA1UEChMNTGV0J3Mg
RW5jcnlwdDEMMAoGA1UEAxMDUjExMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
CgKCAQEAuoe8XBsAOcvKCs3UZxD5ATylTqVhyybKUvsVAbe5KPUoHu0nsyQYOWcJ
DAjs4DqwO3cOvfPlOVRBDE6uQdaZdN5R2+97/1i9qLcT9t4x1fJyyXJqC4N0lZxG
AGQUmfOx2SLZzaiSqhwmej/+71gFewiVgdtxD4774zEJuwm+UE1fj5F2PVqdnoPy
6cRms+EGZkNIGIBloDcYmpuEMpexsr3E+BUAnSeI++JjF5ZsmydnS8TbKF5pwnnw
SVzgJFDhxLyhBax7QG0AtMJBP6dYuC/FXJuluwme8f7rsIU5/agK70XEeOtlKsLP
Xzze41xNG/cLJyuqC0J3U095ah2H2QIDAQABo4H4MIH1MA4GA1UdDwEB/wQEAwIB
hjAdBgNVHSUEFjAUBggrBgEFBQcDAgYIKwYBBQUHAwEwEgYDVR0TAQH/BAgwBgEB
/wIBADAdBgNVHQ4EFgQUxc9GpOr0w8B6bJXELbBeki8m47kwHwYDVR0jBBgwFoAU
ebRZ5nu25eQBc4AIiMgaWPbpm24wMgYIKwYBBQUHAQEEJjAkMCIGCCsGAQUFBzAC
hhZodHRwOi8veDEuaS5sZW5jci5vcmcvMBMGA1UdIAQMMAowCAYGZ4EMAQIBMCcG
A1UdHwQgMB4wHKAaoBiGFmh0dHA6Ly94MS5jLmxlbmNyLm9yZy8wDQYJKoZIhvcN
AQELBQADggIBAE7iiV0KAxyQOND1H/lxXPjDj7I3iHpvsCUf7b632IYGjukJhM1y
v4Hz/MrPU0jtvfZpQtSlET41yBOykh0FX+ou1Nj4ScOt9ZmWnO8m2OG0JAtIIE38
01S0qcYhyOE2G/93ZCkXufBL713qzXnQv5C/viOykNpKqUgxdKlEC+Hi9i2DcaR1
e9KUwQUZRhy5j/PEdEglKg3l9dtD4tuTm7kZtB8v32oOjzHTYw+7KdzdZiw/sBtn
UfhBPORNuay4pJxmY/WrhSMdzFO2q3Gu3MUBcdo27goYKjL9CTF8j/Zz55yctUoV
aneCWs/ajUX+HypkBTA+c8LGDLnWO2NKq0YD/pnARkAnYGPfUDoHR9gVSp/qRx+Z
WghiDLZsMwhN1zjtSC0uBWiugF3vTNzYIEFfaPG7Ws3jDrAMMYebQ95JQ+HIBD/R
PBuHRTBpqKlyDnkSHDHYPiNX3adPoPAcgdF3H2/W0rmoswMWgTlLn1Wu0mrks7/q
pdWfS6PJ1jty80r2VKsM/Dj3YIDfbjXKdaFU5C+8bhfJGqU3taKauuz0wHVGT3eo
6FlWkWYtbt4pgdamlwVeZEW+LM7qZEJEsMNPrfC03APKmZsJgpWCDWOKZvkZcvjV
uYkQ4omYCTX5ohy+knMjdOmdH9c7SpqEWBDC86fiNex+O0XOMEZSa8DA
-----END CERTIFICATE-----
)EOF";


void setup() {
  lcd.init();
  lcd.backlight();
  // lcd.setCursor(0, 0);
  // lcd.print("hello");
  Serial.begin(115200);
  SPI.begin();
  mfrc522.PCD_Init();
  mfrc522Enter.PCD_Init();
  servoEnter.attach(14);
  servoEnter.write(0);  // Start with the barrier closed
  servoExit.attach(27);
  servoExit.write(0);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, HIGH);

  // Connect to Wi-Fi
  connectWiFi();

  // Initialize MQTT
  espClient.setCACert(root_ca);
  client.setServer(mqtt_server, mqtt_port);  // Use the new server and port
  client.setCallback(callback);

  reconnectMQTT();
}

void loop() {
  // Reconnect Wi-Fi if disconnected
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  // Reconnect MQTT if disconnected
  if (!client.connected()) {
    reconnectMQTT();
  }

  client.loop();

  // Handle card scans
  if (readID()) {
    sendCardID(tagID, "exit");
  }

  if (readIDEnter()) {
    sendCardID(tagIDEnter, "enter");
  }

  if (isEntering && millis() - enterOpenTime >= interval) {
    closeBarrierEnter();
  }
  if (isExiting && millis() - exitOpenTime >= interval) {
    closeBarrierExit();
  }

  if (millis() - lastDisplayTime >= displayDuration) {
    lcd.clear();  // Clear after the duration
  }
}

// Connect to Wi-Fi
void connectWiFi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("Connecting to WiFi...");
    delay(1000);
    DisplayText("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

// Reconnect to MQTT broker
void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    DisplayText("Connecting to MQTT...");
    // Attempt to connect with credentials
    if (client.connect(deviceId, mqtt_user, mqtt_password, lwt_topic, 1, true, offline_status)) {
      Serial.println("Connected to MQTT!");
      DisplayText("Connected to MQTT!");
      client.publish(status_topic, online_status, true);  // Publish online status
      client.subscribe(enter_topic);
      client.subscribe(exit_topic);


    } else {
      Serial.print("MQTT connection failed, state: ");
      Serial.println(client.state());
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

// Handle received MQTT messages
void callback(char* topic, byte* payload, unsigned int length) {
  String msg;
  for (int i = 0; i < length; i++) {
    msg += (char)payload[i];
  }
  Serial.print("Received from ");
  Serial.print(topic);
  Serial.print(": ");
  Serial.println(msg);

  // Extract the message from the payload
  int startIndex = msg.indexOf("\"message\":\"") + 11;  // Find the start of the message
  int endIndex = msg.indexOf("\"", startIndex);         // Find the end of the message

  // Check if the message was found


  if (String(topic) == exit_topic && msg.indexOf("\"status\":\"valid\"") > 0) {
    openBarrierExit();
  } else if (String(topic) == enter_topic && msg.indexOf("\"status\":\"valid\"") > 0) {
    openBarrierEnter();
  }

  if (startIndex >= 12 && endIndex > startIndex) {
    String messageToDisplay = msg.substring(startIndex, endIndex);  // Extract the message
    DisplayText(messageToDisplay);
  }
}

// Open the barrier
void openBarrierEnter() {
  if (!isEntering) {
    digitalWrite(ledPin, LOW);
    servoEnter.write(90);
    isEntering = true;
    enterOpenTime = millis();  // Record the time the gate was opened
  }
}

// Open the barrier for exit
void openBarrierExit() {
  if (!isExiting) {
    digitalWrite(ledPin, HIGH);
    servoExit.write(90);
    isExiting = true;
    exitOpenTime = millis();  // Record the time the gate was opened
  }
}

// Close the entry barrier
void closeBarrierEnter() {
  servoEnter.write(0);
  isEntering = false;  // Reset state
}

// Close the exit barrier
void closeBarrierExit() {
  servoExit.write(0);
  isExiting = false;  // Reset state
}

// Read RFID tag for exit
boolean readID() {
  if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial()) return false;

  tagID = "";
  for (uint8_t i = 0; i < 4; i++) {
    tagID.concat(String(mfrc522.uid.uidByte[i], HEX));
  }
  tagID.toUpperCase();
  mfrc522.PICC_HaltA();
  return true;
}

// Read RFID tag for entry
boolean readIDEnter() {
  if (!mfrc522Enter.PICC_IsNewCardPresent() || !mfrc522Enter.PICC_ReadCardSerial()) return false;

  tagIDEnter = "";
  for (uint8_t i = 0; i < 4; i++) {
    tagIDEnter.concat(String(mfrc522Enter.uid.uidByte[i], HEX));
  }
  tagIDEnter.toUpperCase();
  mfrc522Enter.PICC_HaltA();
  return true;
}

// Send card ID to MQTT broker
void sendCardID(String id, String action) {
  String payload = "{\"card_number\": \"" + id + "\", \"embed_id\": \"" + deviceId + "\", \"action\": \"" + action + "\"}";
  const char* topic = (action == "enter") ? "barrier/enter" : "barrier/exit";
  client.publish(topic, payload.c_str());
  Serial.print("Sent to ");
  Serial.print(topic);
  Serial.print(": ");
  Serial.println(payload);
}

// Display message on LCD
void DisplayText(String text) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(text);
    lastDisplayTime = millis(); // Record the time of display
}