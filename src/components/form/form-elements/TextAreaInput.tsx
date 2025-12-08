import { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import TextArea from "../input/TextArea";
import { FormField } from "./SelectFiled";

export default function TextAreaInput() {
  const [message, setMessage] = useState("");
  const [messageTwo, setMessageTwo] = useState("");
  return (
    <ComponentCard title="Textarea input field">
      <div className="space-y-6">
        {/* Default TextArea */}
        <FormField label="Description">
          <TextArea
            value={message}
            onChange={(value) => setMessage(value)}
            rows={6}
          />
        </FormField>

        {/* Disabled TextArea */}
        <FormField label="Description">
          <TextArea rows={6} disabled />
        </FormField>

        {/* Error TextArea */}
        <FormField label="Description" error="Please enter a valid message.">
          <TextArea
            rows={6}
            value={messageTwo}
            error
            onChange={(value) => setMessageTwo(value)}
          />
        </FormField>
      </div>
    </ComponentCard>
  );
}
