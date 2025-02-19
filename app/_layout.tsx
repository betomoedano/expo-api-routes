import ThemeProvider from "@/components/ui/ThemeProvider";

import Tabs from "@/components/ui/Tabs";

export default function Layout() {
  return (
    <ThemeProvider>
      <Tabs>
        <Tabs.Screen name="(index)" systemImage="house.fill" title="Home" />
        <Tabs.Screen
          name="(info)"
          systemImage="cursorarrow.rays"
          title="Info"
        />
      </Tabs>
    </ThemeProvider>
  );
}
