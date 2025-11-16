import ColorProvider from "./color";
import I18nProvider from "./i18n";
import ThemeProvider from "./theme";

export default async function Providers({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  return (
    <I18nProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ColorProvider>{children}</ColorProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
