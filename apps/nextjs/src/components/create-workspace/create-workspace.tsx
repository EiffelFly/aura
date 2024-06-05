"use client";

import { EraserIcon, LayersIcon } from "@radix-ui/react-icons";
import { z } from "zod";

import { Button } from "@aura/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  useForm,
  zodResolver,
} from "@aura/ui/form";
import { toast } from "@aura/ui/toast";

import { api } from "~/trpc/react";

const createWorkspaceSchema = z.object({
  name: z.string(),
});

export const CreateWorkspace = ({ userId }: { userId: string }) => {
  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const utils = api.useUtils();
  const createWorkspace = api.workspace.create.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.workspace.invalidate();
    },
    onError: () => {
      toast.error("Failed to create workspace");
    },
  });

  function onSubmit(values: z.infer<typeof createWorkspaceSchema>) {
    createWorkspace.mutate({
      owner_id: userId,
      name: values.name,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full w-full flex-col"
      >
        <div className="mb-auto flex flex-col">
          <div className="mb-[72px] flex flex-row gap-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border">
              <LayersIcon className="h-4 w-4 stroke-primary" />
            </div>
            <h2 className="pt-0.5 text-2xl font-semibold text-primary">
              Create new workspace
            </h2>
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <h3 className="text-2xl font-semibold text-primary">Name</h3>
                <FormControl>
                  <input
                    {...field}
                    className="h-24 w-full rounded-lg border border-border px-4 font-mono text-3xl text-primary"
                  />
                </FormControl>
                <p className="font-sans text-lg font-semibold text-border">
                  Your workspace name
                </p>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-y-4">
          <Button
            type="submit"
            size="lg"
            className="ml-auto border-border"
            variant="outline"
          >
            Create
          </Button>
          <div className="ml-auto flex flex-row gap-x-4">
            <EraserIcon className="h-6 w-6 stroke-border" />
            <p className="font-sans text-[20px] font-normal text-secondary">
              Don’t worry, you can change these configurations later
            </p>
          </div>
        </div>
      </form>
    </Form>
  );
};
