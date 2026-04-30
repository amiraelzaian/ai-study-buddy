"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function TestPage() {
  const [data, setData] = useState("");

  const testAPI = async () => {
    try {
      toast.loading("Testing AI...");

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: "What is binary search?",
          subject: "CS",
          mode: "explain",
          userId: "123",
        }),
      });

      const result = await res.json();

      toast.dismiss();

      if (!res.ok) {
        toast.error(result.error || "Error");
        return;
      }

      toast.success("Success!");
      setData(JSON.stringify(result, null, 2));
    } catch (err) {
      toast.dismiss();
      toast.error("Network error");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={testAPI}>Test AI API</button>

      <pre>{data}</pre>
    </div>
  );
}
