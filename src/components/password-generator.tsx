// components/PasswordGenerator.tsx
"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, RefreshCw, Lock } from "lucide-react";

interface GeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeLookAlikes: boolean;
}

const initialOptions: GeneratorOptions = {
  length: 16,
  includeUppercase: true,
  includeNumbers: true,
  includeSymbols: false,
  excludeLookAlikes: false,
};

export default function PasswordGenerator() {
  const [password, setPassword] = useState("P@sswordG3n3rat0r"); // Placeholder
  const [options, setOptions] = useState<GeneratorOptions>(initialOptions);
  const [copied, setCopied] = useState(false);

  // Simple password generator logic
  const generateStrongPassword = (options: GeneratorOptions): void => {
    console.log("Generating password with options:", options);
    // Character sets
    const LOWER = "abcdefghjkmnpqrstuvwxyz"; // Exclude l,o if excludeLookAlikes
    const UPPER = "ABCDEFGHJKMNPQRSTUVWXYZ"; // Exclude L,O if excludeLookAlikes
    const NUMBERS = "23456789"; // Exclude 0, 1 if excludeLookAlikes
    const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>?";

    let lower = LOWER;
    let upper = UPPER;
    let numbers = NUMBERS;
    let symbols = SYMBOLS;

    if (!options.excludeLookAlikes) {
      lower = "abcdefghijklmnopqrstuvwxyz";
      upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      numbers = "0123456789";
    }
    // Initialize charset with lowercase after that
    // Build charset based on options
    let charset = lower;
    if (options.includeUppercase) charset += upper;
    if (options.includeNumbers) charset += numbers;
    if (options.includeSymbols) charset += symbols;

    if (charset.length === 0) return;

    // Ensure at least one character from each selected set
    const required: string[] = [];
    if (options.includeUppercase)
      required.push(upper[Math.floor(Math.random() * upper.length)]);
    if (options.includeNumbers)
      required.push(numbers[Math.floor(Math.random() * numbers.length)]);
    if (options.includeSymbols)
      required.push(symbols[Math.floor(Math.random() * symbols.length)]);

    // Fill the rest
    const restLength = options.length - required.length;
    let passwordArr = [];
    for (let i = 0; i < restLength; i++) {
      passwordArr.push(charset[Math.floor(Math.random() * charset.length)]);
    }
    // Shuffle required chars into password
    passwordArr = passwordArr.concat(required);
    for (let i = passwordArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // Swap for shuffle
      [passwordArr[i], passwordArr[j]] = [passwordArr[j], passwordArr[i]];
    }
    setPassword(passwordArr.join(""));
  };
  //   const generatePassword = () => {
  //     console.log("Generating password with options:", options);
  //     const newPass =
  //       Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  //     setPassword(newPass.slice(0, options.length));
  //   };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);

    // Copy to clipboard with auto-clear (Must-have)
    setTimeout(() => {
      navigator.clipboard.writeText(""); // Overwrite with empty string
      setCopied(false);
    }, 15000); // 15 seconds
  };

  const handleOptionChange = (
    key: keyof GeneratorOptions,
    value: number | boolean
  ) => {
    setOptions((prev) => ({ ...prev, [key]: value as any }));
  };

  React.useEffect(() => {
    generateStrongPassword(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-primary">
          <Lock className="w-5 h-5 mr-2" /> Strong Password Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Generated Password Display */}
        <div className="flex items-center space-x-2 mb-6">
          <Input
            type="text"
            readOnly
            value={password}
            className="flex-grow font-mono text-lg bg-muted/50"
          />
          <Button
            onClick={() => generateStrongPassword(options)}
            variant="outline"
            size="icon"
            title="Regenerate"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleCopy}
            title="Copy to Clipboard"
            size="icon"
            className={copied ? "bg-green-500 hover:bg-green-600" : ""}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        {copied && (
          <p className="text-sm text-green-600 mb-4">
            Copied! Will auto-clear in 15 seconds.
          </p>
        )}

        {/* Options */}
        <div className="space-y-6">
          {/* Length Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Password Length</Label>
              <span className="font-bold text-primary">{options.length}</span>
            </div>
            <Slider
              min={8}
              max={32}
              step={1}
              value={[options.length]}
              onValueChange={([value]) => handleOptionChange("length", value)}
            />
          </div>

          {/* Checkbox Options */}
          <div className="grid grid-cols-2 gap-4">
            <OptionCheckbox
              label="Include Uppercase (A-Z)"
              checked={options.includeUppercase}
              onCheckedChange={(checked) =>
                handleOptionChange("includeUppercase", checked as boolean)
              }
            />
            <OptionCheckbox
              label="Include Numbers (0-9)"
              checked={options.includeNumbers}
              onCheckedChange={(checked) =>
                handleOptionChange("includeNumbers", checked as boolean)
              }
            />
            <OptionCheckbox
              label="Include Symbols (!@#$)"
              checked={options.includeSymbols}
              onCheckedChange={(checked) =>
                handleOptionChange("includeSymbols", checked as boolean)
              }
            />
            <OptionCheckbox
              label="Exclude Look-alikes (0/O, 1/l)"
              checked={options.excludeLookAlikes}
              onCheckedChange={(checked) =>
                handleOptionChange("excludeLookAlikes", checked as boolean)
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper component for cleaner options
interface CheckboxProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean | "indeterminate") => void;
}

const OptionCheckbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onCheckedChange,
}) => (
  <div className="flex items-center space-x-2">
    <Checkbox id={label} checked={checked} onCheckedChange={onCheckedChange} />
    <Label htmlFor={label} className="text-sm cursor-pointer">
      {label}
    </Label>
  </div>
);
