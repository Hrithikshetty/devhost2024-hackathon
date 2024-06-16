"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/Label";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input"; 

// Define types for user data
interface UserData {
  username: string;
  nmcUid: string;
  email: string;
}

export default function DocHome() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/users/current-user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const currentUserId = localStorage.getItem("nmcUid"); 
          const currentUser = data.data.find((user: UserData) => user.nmcUid === currentUserId);

          if (currentUser) {
            setUserData(currentUser); 
          } else {
            setError("Current user not found"); 
          }
        } else {
          setError("Failed to fetch user data"); 
        }
      } catch (error) {
        console.error("Error fetching user data:", error); 
        setError("An error occurred while fetching user data");
      } finally {
        setLoading(false); 
      }
    };

    fetchCurrentUser(); 
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gradient-to-br bg-white min-h-screen flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-black p-6 flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">{userData?.username}</h2>
              <p className="text-gray-200">NMCUID: {userData?.nmcUid}</p>
              <p className="text-gray-200">{userData?.email}</p>
            </div>
            <Avatar className="border-4 border-white">
              <AvatarImage alt={userData?.username} src="/placeholder-user.jpg" />
              <AvatarFallback>{userData?.username ? userData.username.charAt(0) : 'U'}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <Card className="bg-gray-100 shadow-lg text-black">
          <CardHeader>
            <CardTitle className="text-black">Check Patient Profile</CardTitle>
            <CardDescription>Enter the unique code provided to Patient to access Patient profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="space-y-4 text-black">
                <div>
                  <h3 className="font-semibold">Unique Code</h3>
                  <Input
                    className="mt-1 text-white"
                    id="code"
                    placeholder="Enter your code"
                    type="text"
                  />
                </div>
                <Button className="w-full bg-black text-white" type="submit">
                  Check Profile
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
