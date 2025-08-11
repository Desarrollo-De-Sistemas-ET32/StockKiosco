"use client";
import React, { useState, useTransition } from "react";

import { z } from "zod";
import { registerSchema } from "../lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { registerAction } from "@/actions/auth-actions";
import { useRouter } from "next/navigation";


const formRegister = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setError(null)
    startTransition(async () => {
      const response = await registerAction(values);
      console.log(response);
      if (response.error) {
        setError(response.error);
      } else {
        router.push("/dashboard")
      }

    });
  }


  return (
    <div className="max-w-52">
        <h1>Register</h1>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                <Input placeholder="nombre" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                <FormLabel>Correo Electronico</FormLabel>
                <FormControl>
                <Input placeholder="email" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                <Input type="password" placeholder="password" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            {
            error && <FormMessage>{error}</FormMessage>
            }
            <Button type="submit" disabled={isPending}>Submit</Button>
        </form>
        </Form>
    </div>
  );
};

export default formRegister;