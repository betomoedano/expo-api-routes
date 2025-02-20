import React, { useState } from "react";

import * as Form from "@/components/ui/Form";
import { IconSymbol } from "@/components/ui/IconSymbol";
import * as AC from "@bacons/apple-colors";
import {
  Image,
  TextInput,
  View,
  Text,
  Platform,
  Pressable,
} from "react-native";
import { useColorScheme } from "react-native";
export default function Page() {
  const colorScheme = useColorScheme();
  const [content, setContent] = useState("");
  return (
    <View style={{ flex: 1 }}>
      <Form.List navigationTitle="Home">
        <Form.Section
          title="Create Post"
          footer="By posting, you agree to the Terms of Service and Privacy Policy."
        >
          <Form.HStack style={{ gap: 16 }}>
            <TextInput
              value={content}
              multiline={true}
              onChangeText={setContent}
              placeholder="What's on your mind?"
              placeholderTextColor={AC.systemGray}
              style={{
                flexGrow: 1,
                maxWidth: "80%",
                borderWidth: 1,
                borderColor: AC.separator,
                borderRadius: 8,
                padding: 12,
                color: colorScheme === "dark" ? "white" : "black",
              }}
            />
            <Form.Link
              disabled={content.length === 0}
              href={{
                pathname: "/account",
                params: { content },
              }}
            >
              <IconSymbol
                color={AC.systemOrange}
                name={Platform.OS !== "ios" ? "sparkle" : "sparkles"}
                size={30}
                animationSpec={{
                  effect: {
                    type: "pulse",
                  },
                  repeating: true,
                }}
              />
            </Form.Link>
          </Form.HStack>
        </Form.Section>

        <Form.Section title="Recent Posts">
          {dummyPosts.map((post) => (
            <Form.Link
              key={post.id}
              href="/two"
              systemImage={post.isLiked ? "heart.fill" : "heart"}
              style={{
                overflow: "hidden",
                flexShrink: 1,
              }}
            >
              {post.text}
            </Form.Link>
          ))}
        </Form.Section>
      </Form.List>
    </View>
  );
}

const dummyPosts = [
  {
    id: 1,
    text: "🌟 Just launched my new app! So excited to share it with everyone. The journey of building it has been amazing! 🚀 #coding #launch",
    isLiked: false,
  },
  {
    id: 2,
    text: "🎨 Working on some new UI designs today. Love how the color palette is coming together! 🖌️ Anyone else get super excited about gradients?",
    isLiked: true,
  },
  {
    id: 3,
    text: "🏃‍♂️ Morning run complete! 5 miles and feeling energized. Starting the day right! ☀️ #fitness #motivation",
    isLiked: false,
  },
];
