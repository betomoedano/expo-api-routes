import * as Form from "@/components/ui/Form";
import * as AC from "@bacons/apple-colors";
import { Text, Button, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { fetch } from "expo/fetch";

import Constants from "expo-constants";

const API_URL = "https://api.routes.expo.app";

const generateAPIUrl = (relativePath: string) => {
  console.log("Constants", Constants.experienceUrl);

  const origin =
    Constants?.experienceUrl?.replace("exp://", "http://") || API_URL;

  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;

  if (process.env.NODE_ENV === "development") {
    return origin?.concat(path);
  }

  if (!API_URL) {
    throw new Error("API_URL environment variable is not defined");
  }

  return API_URL.concat(path);
};

interface AIResponse {
  title: string;
  content: string;
  thoughts: string;
  post_rate: number;
}

export default function Page() {
  const { content } = useLocalSearchParams();
  const [aiResponse, setAIResponse] = useState<AIResponse | null>(null);
  const [partialJson, setPartialJson] = useState("");

  useEffect(() => {
    fetchAI();
  }, []);

  async function fetchAI() {
    const response = await fetch(generateAPIUrl("/api/ai"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      console.error("Failed to fetch AI", response);
      return;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader?.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      processChunk(text);
    }
  }

  const processChunk = (chunk: string) => {
    try {
      const accumulated = partialJson + chunk;

      try {
        const parsedData = JSON.parse(accumulated);
        setAIResponse(parsedData);
        setPartialJson("");
      } catch (error) {
        setPartialJson(accumulated);
      }
    } catch (error) {
      console.error("Error processing chunk:", error);
    }
  };

  return (
    <Form.List navigationTitle="AI Post Analysis">
      {Platform.OS === "web" && (
        <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}>
          AI Post Analysis
        </Text>
      )}
      <Form.Section
        shouldRasterizeIOS={false}
        title={"Recommended title"}
        style={{}}
      >
        <Text style={{}}>{aiResponse?.title}</Text>
      </Form.Section>
      <Form.Section
        shouldRasterizeIOS={false}
        title={"Recommended content"}
        style={{}}
      >
        <Text style={{}}>{aiResponse?.content}</Text>
      </Form.Section>
      <Form.Section
        shouldRasterizeIOS={false}
        title={"What I think about this post"}
        style={{}}
      >
        <Text style={{}}>{aiResponse?.thoughts}</Text>
      </Form.Section>
      <Form.Section
        shouldRasterizeIOS={false}
        title={"Overall post quality"}
        style={{}}
      >
        <Text
          style={{
            color:
              aiResponse?.post_rate > 8
                ? AC.systemGreen
                : aiResponse?.post_rate > 5
                ? AC.systemYellow
                : AC.systemRed,
          }}
        >
          {aiResponse?.post_rate}
        </Text>
      </Form.Section>
      <Form.HStack style={{ justifyContent: "center", gap: 12 }}>
        <Button title="Reject" color={AC.systemRed} />
        <Button title="Accept" color={AC.systemBlue} />
      </Form.HStack>
    </Form.List>
  );
}
