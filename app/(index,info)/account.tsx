import * as Form from "@/components/ui/Form";
import * as AC from "@bacons/apple-colors";
import { Text, Button } from "react-native";

export default function Page() {
  return (
    <Form.List navigationTitle="AI Tools">
      <Form.Section shouldRasterizeIOS={false} style={{}}>
        <Text style={{}}>
          Generate a creative story about a magical forest Generate a creative
          story about a magical forest Generate a creative story about a magical
          forest Generate a creative story about a magical forest Generate a
          creative story about a magical forest Generate a creative story about
          a magical forest
        </Text>
        <Form.Text style={Form.FormFont.caption}>Today at 2:34 PM</Form.Text>
        <Form.HStack style={{ justifyContent: "center", gap: 12 }}>
          <Button title="Reject" color={AC.systemRed} />
          <Button title="Accept" color={AC.systemBlue} />
        </Form.HStack>
      </Form.Section>
    </Form.List>
  );
}
