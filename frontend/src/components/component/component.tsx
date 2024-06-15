import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Component() {
  return (
    <div className="bg-gradient-to-br from-[#6366F1] to-[#9333EA] min-h-screen flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-[#6366F1] p-6 flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Dr. Jane Doe</h2>
              <p className="text-gray-200">NMCUID: 12345678</p>
              <p className="text-gray-200">jane.doe@example.com</p>
            </div>
            <Avatar className="border-4 border-white">
              <AvatarImage alt="Dr. Jane Doe" src="/placeholder-user.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Check Your Profile</CardTitle>
            <CardDescription>Enter the unique code provided to you to access your profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="code">Unique Code</Label>
                  <Input className="mt-1" id="code" placeholder="Enter your code" type="text" />
                </div>
                <Button className="w-full" type="submit">
                  Check Profile
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
