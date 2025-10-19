import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod/v3";
import { usePlayers } from "../app/providers/players-provider";
import { showSuccess } from "@/lib/toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Combobox } from "@/components/ui/combobox";

const schema = z
  .object({
    playerAId: z.string().nonempty("Select player A"),
    playerBId: z.string().nonempty("Select player B"),
    scoreA: z
      .number()
      .int()
      .min(0, "Scores cannot be negative")
      .max(1000, "Scores are unrealistically high — please check again"),
    scoreB: z
      .number()
      .int()
      .min(0, "Scores cannot be negative")
      .max(1000, "Scores are unrealistically high — please check again"),
  })
  .refine((d) => d.playerAId !== d.playerBId, {
    message: "Players must be different",
    path: ["playerBId"],
  })
  .refine((d) => d.scoreA !== d.scoreB, {
    message: "Game cannot end in a draw",
    path: ["scoreB"],
  })
  .refine((d) => d.scoreA > 0 || d.scoreB > 0, {
    message: "At least one player must have a non-zero score",
    path: ["scoreA"],
  });

type FormSchema = z.infer<typeof schema>;

export default function GameForm() {
  const { players, addGame } = usePlayers();

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      playerAId: players[0]?.id ?? "",
      playerBId: players[1]?.id ?? "",
      scoreA: 0,
      scoreB: 0,
    },
  });

  const { handleSubmit, reset, setValue, watch } = form;

  useEffect(() => {
    if (!watch("playerAId") && players[0]) setValue("playerAId", players[0].id);
    if (!watch("playerBId") && players[1]) setValue("playerBId", players[1].id);
  }, [players]);

  const onSubmit = (values: FormSchema) => {
    addGame({
      playerAId: values.playerAId,
      playerBId: values.playerBId,
      scoreA: Number(values.scoreA),
      scoreB: Number(values.scoreB),
    });

    reset({
      playerAId: players[0]?.id ?? "",
      playerBId: players[1]?.id ?? "",
      scoreA: 0,
      scoreB: 0,
    });

    showSuccess("Game recorded");
  };

  const items = players.map((p) => ({ id: p.id, label: p.name }));
  const selectedA = watch("playerAId");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Game</CardTitle>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="playerAId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player A</FormLabel>
                      <FormControl>
                        <Combobox
                          items={items}
                          value={field.value}
                          onValueChange={(v) => field.onChange(v)}
                          placeholder="Select player A..."
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="playerBId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player B</FormLabel>
                      <FormControl>
                        <Combobox
                          items={items}
                          value={field.value}
                          onValueChange={(v) => field.onChange(v)}
                          placeholder="Select player B..."
                          exclude={(id: string) => id === selectedA}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="scoreA"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Score A</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={String(field.value ?? 0)}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scoreB"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Score B</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={String(field.value ?? 0)}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="pt-4 ml-auto">
              <Button type="submit">Save Game</Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
