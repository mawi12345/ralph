export function Footer({ text }: { text: string }) {
  return (
    <style>{`
  @page {
    @bottom-left {
      content: "${text}";
    }
  }
`}</style>
  );
}
