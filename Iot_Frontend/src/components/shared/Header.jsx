import React from 'react'
import { Bell, ChevronDown, Search } from 'lucide-react'
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-white border-b">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      {/* <Input type="text" placeholder="Search" className="pl-10 pr-4 py-2 w-64" /> */}
    </div>
    <div className="flex items-center space-x-4">
      <Bell className="text-gray-500" />
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
        <span>Delicious Burger</span>
        <ChevronDown className="text-gray-500" />
      </div>
    </div>
  </header>
  )
}

export default Header
