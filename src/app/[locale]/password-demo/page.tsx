'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PasswordInput } from '@/components/ui/password-input';
import { PasswordStrengthIndicator } from '@/components/ui/password-strength-indicator';
import { validatePasswordStrength } from '@/utils/passwordStrength';

export default function PasswordDemoPage() {
  const [password, setPassword] = useState('');
  const strengthResult = validatePasswordStrength(password);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Password Strength Demo</h1>
        <p className="text-muted-foreground mt-2">
          Test the password strength validation system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Password Input Test</CardTitle>
          <CardDescription>
            Enter a password to see the strength validation in action
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Test Password</label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a password to test..."
              className="w-full"
            />
          </div>

          <PasswordStrengthIndicator 
            password={password}
            showRequirements={true}
          />

          {password && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-sm">Technical Details</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div>
                  <strong>Score:</strong> {strengthResult.score}/4
                </div>
                <div>
                  <strong>Is Valid:</strong> {strengthResult.isValid ? '✅ Yes' : '❌ No'}
                </div>
                <div>
                  <strong>Length:</strong> {password.length} characters
                </div>
                <div>
                  <strong>Unique Characters:</strong> {new Set(password).size}
                </div>
                {strengthResult.feedbackKeys.length > 0 && (
                  <div>
                    <strong>Feedback Keys:</strong>
                    <ul className="list-disc list-inside ml-2">
                      {strengthResult.feedbackKeys.map((key, idx) => (
                        <li key={idx}>{key}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Example Passwords</CardTitle>
          <CardDescription>
            Click to test different password strengths
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { label: 'Very Weak', password: '123' },
              { label: 'Weak', password: 'password' },
              { label: 'Fair', password: 'Password123' },
              { label: 'Strong', password: 'MyStr0ng!Pass' },
              { label: 'Very Strong', password: 'MyVery$tr0ng!P@ssw0rd2024' }
            ].map((example) => (
              <button
                key={example.label}
                onClick={() => setPassword(example.password)}
                className="text-left p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="font-medium">{example.label}</div>
                <div className="text-sm text-muted-foreground font-mono">
                  {example.password}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 