import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// If you have a textarea component from shadcn, import it. Otherwise, use a regular textarea.

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  function validate() {
    const newErrors: { name?: string; email?: string; message?: string } = {};
    if (name.trim().length < 2) newErrors.name = "Name is required";
    if (!validateEmail(email)) newErrors.email = "Invalid email";
    if (message.trim().length < 10) newErrors.message = "Message is too short";
    return newErrors;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      alert(JSON.stringify({ name, email, message }, null, 2));
      setName("");
      setEmail("");
      setMessage("");
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
        <CardDescription>
          Send us a message and we'll get back to you soon.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <div className="text-red-500 text-xs mt-1">{errors.name}</div>
            )}
          </div>
          <div>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <div className="text-red-500 text-xs mt-1">{errors.email}</div>
            )}
          </div>
          <div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your Message"
              aria-invalid={!!errors.message}
              rows={5}
              className="w-full border rounded-md p-2"
            />
            {errors.message && (
              <div className="text-red-500 text-xs mt-1">{errors.message}</div>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={onSubmit}>
          Send
        </Button>
      </CardFooter>
    </Card>
  );
}
