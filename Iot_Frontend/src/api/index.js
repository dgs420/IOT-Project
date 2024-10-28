// import axios from 'axios';

// export interface ResponseDataType<T> {
//   code: number;
//   msg: string | string[];
//   info?: T;
// }

// async function returnResponseData(
//   response: any,
//   callback: () => void
// ): Promise<any> {
//   if (response.data.code === -1001) {
//     console.log('expired');

//     if (await refreshToken()) return;

//     return await callback();
//   }

//   return response.data;
// }

// export async function postRequest(
//   url,
//   body,
//   type: 'form-data' | 'json' = 'json'
// ): Promise<any> {
//   try {
//     let response = await axios.post(
//       process.env.REACT_APP_BASE_URL + '/api' + url,
//       body,
//       type === 'json'
//         ? generateRequestHeader()
//         : generateRequestFormDataHeader()
//     );

//     return returnResponseData(
//       response,
//       async () => await postRequest(url, body, type)
//     );
//   } catch (error: any) {
//     return error?.response?.data;
//   }
// }

// export async function postRequestBio(
//   url: string,
//   body?: any,
//   type: 'form-data' | 'json' = 'json'
// ): Promise<any> {
//   try {
//     let response = await axios.post(
//       process.env.REACT_APP_BIO_LAB_BASE_URL + url,
//       body,
//       type === 'json'
//         ? generateRequestHeader()
//         : generateRequestFormDataHeader()
//     );

//     return returnResponseData(
//       response,
//       async () => await postRequest(url, body, type)
//     );
//   } catch (error: any) {
//     return error?.response?.data;
//   }
// }

// export async function putRequest(
//   url: string,
//   body?: any,
//   type: 'form-data' | 'json' = 'json'
// ): Promise<any> {
//   try {
//     let response = await axios.put(
//       process.env.REACT_APP_BASE_URL + '/api' + url,
//       body,
//       type === 'json'
//         ? generateRequestHeader()
//         : generateRequestFormDataHeader()
//     );

//     return returnResponseData(
//       response,
//       async () => await putRequest(url, body, type)
//     );
//   } catch (error: any) {
//     return error?.response?.data;
//   }
// }

// export async function patchRequest(
//   url: string,
//   body?: any,
//   type: 'form-data' | 'json' = 'json'
// ): Promise<any> {
//   try {
//     let response = await axios.patch(
//       process.env.REACT_APP_BASE_URL + '/api' + url,
//       body,
//       type === 'json'
//         ? generateRequestHeader()
//         : generateRequestFormDataHeader()
//     );

//     return returnResponseData(
//       response,
//       async () => await patchRequest(url, body, type)
//     );
//   } catch (error: any) {
//     return error?.response?.data;
//   }
// }

// export async function getRequest(url: string): Promise<any> {
//   try {
//     let response = await axios.get(
//       process.env.REACT_APP_BASE_URL + '/api' + url,
//       generateRequestHeader()
//     );

//     return returnResponseData(response, async () => await getRequest(url));
//   } catch (error: any) {
//     return error?.response?.data;
//   }
// }

// export async function deleteRequest(url: string): Promise<any> {
//   try {
//     let response = await axios.delete(
//       process.env.REACT_APP_BASE_URL + '/api' + url,
//       generateRequestHeader()
//     );

//     return returnResponseData(response, async () => await deleteRequest(url));
//   } catch (error: any) {
//     return error?.response?.data;
//   }
// }

// export function generateRequestHeader() {
//   return {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//     },
//   };
// }

// // export function generateRequestFormDataHeader() {
//   return {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//       Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//     },
//   };
// }

