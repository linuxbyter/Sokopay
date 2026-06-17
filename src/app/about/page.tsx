export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-6">
      <h1 className="text-4xl font-bold text-neutral-900 mb-4">
        About SokoPay
      </h1>
      <p className="text-lg text-neutral-600 max-w-2xl text-center">
        SokoPay connects customers with local vendors in Kenyan markets, enabling
        seamless ordering, payment, and delivery of fresh food and goods.
      </p>
      <a
        href="/"
        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Back to Home
      </a>
    </div>
  );
}