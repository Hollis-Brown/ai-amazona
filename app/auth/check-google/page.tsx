'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'

export default function CheckGooglePage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [details, setDetails] = useState<any>(null)

  useEffect(() => {
    const checkGoogleConfig = async () => {
      try {
        const response = await fetch('/api/auth/check-google')
        const data = await response.json()
        
        if (response.ok) {
          setStatus('success')
          setMessage(data.message)
        } else {
          setStatus('error')
          setMessage(data.error)
          setDetails(data)
        }
      } catch (error) {
        setStatus('error')
        setMessage('Failed to check Google OAuth configuration')
        setDetails(error)
      }
    }
    
    checkGoogleConfig()
  }, [])

  return (
    <div className="container max-w-2xl mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Google OAuth Configuration Check</CardTitle>
          <CardDescription>
            This page checks if your Google OAuth credentials are properly configured.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === 'loading' && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          
          {status === 'success' && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {message}
              </AlertDescription>
            </Alert>
          )}
          
          {status === 'error' && (
            <>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {message}
                </AlertDescription>
              </Alert>
              
              {details && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Details:</h3>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(details, null, 2)}
                  </pre>
                </div>
              )}
              
              <div className="space-y-4">
                <h3 className="font-medium">How to fix:</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a></li>
                  <li>Create a new project or select an existing one</li>
                  <li>Navigate to "APIs & Services" &gt; "Credentials"</li>
                  <li>Click "Create Credentials" &gt; "OAuth client ID"</li>
                  <li>Select "Web application" as the application type</li>
                  <li>Set the following:
                    <ul className="list-disc pl-5 mt-1">
                      <li><strong>Name</strong>: Your application name (e.g., "AI Amazona")</li>
                      <li><strong>Authorized JavaScript origins</strong>: Add <code>http://localhost:3000</code> (for development)</li>
                      <li><strong>Authorized redirect URIs</strong>: Add <code>http://localhost:3000/api/auth/callback/google</code></li>
                    </ul>
                  </li>
                  <li>Click "Create" to get your Client ID and Client Secret</li>
                  <li>Add these credentials to your .env file:
                    <pre className="bg-gray-100 p-2 rounded mt-1 text-xs">
                      GOOGLE_CLIENT_ID="your_actual_google_client_id"
                      GOOGLE_CLIENT_SECRET="your_actual_google_client_secret"
                    </pre>
                  </li>
                  <li>Restart your development server</li>
                </ol>
              </div>
            </>
          )}
          
          <div className="flex justify-end">
            <Button onClick={() => window.location.reload()}>
              Check Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 