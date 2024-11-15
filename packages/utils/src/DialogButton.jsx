import React, { Fragment, useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { FocusScope } from "@radix-ui/react-focus-scope";

import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

import { Button } from "./Button";

import { cva } from "class-variance-authority";
//my custom functions
import { cn } from "../functions/cn";

export function DialogButton({
  children,
  isModal = false,
  onOpenChange,
  className,
}) {
  return (
    <div className={className}>
      <Dialog.Root onOpenChange={onOpenChange} modal={isModal}>
        {children}
      </Dialog.Root>
    </div>
  );
}

function ModalContent({ title, children, className, variant, size, ...props }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=closed]:animate-[dialog-overlay-hide_200ms] data-[state=open]:animate-[dialog-overlay-show_200ms]" />
      <Dialog.Content
        className={cn(contentVariants({ variant, size }), className)}
        //className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-8 text-gray-900 shadow data-[state=closed]:animate-[dialog-content-hide_200ms] data-[state=open]:animate-[dialog-content-show_200ms]"
      >
        <Dialog.DialogDescription></Dialog.DialogDescription>
        <div className="flex items-center justify-between">
          <Dialog.Title className="text-xl">{title}</Dialog.Title>
          <Dialog.Close className="text-primary-foreground hover:text-accent">
            <CloseIcon />
          </Dialog.Close>
        </div>

        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}

const contentVariants = cva(
  "-translate-x-1/2 -translate-y-1/2 rounded-md p-8 text-gray-900 shadow data-[state=closed]:animate-[dialog-content-hide_200ms] data-[state=open]:animate-[dialog-content-show_200ms]",
  {
    variants: {
      variant: {
        default: "bg-muted text-primary-foreground",
        grey: "bg-gray-200 text-gray-800",
        red: "bg-red-200 text-red-800",
        danger: "bg-red-700 text-white",
      },
      size: {
        default: "fixed left-1/2 top-1/2 w-full max-w-md",
        big: "fixed left-1/2 top-1/2 w-full max-w-4xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

DialogButton.Button = Dialog.Trigger;
DialogButton.Content = ModalContent;
DialogButton.Close = Dialog.Close;
