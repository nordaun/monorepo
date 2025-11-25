export default async function HomePage() {
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return <div>Page</div>;
}
