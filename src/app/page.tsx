export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-royal-brown mb-6">
          RoyalPet
        </h1>
        <p className="text-lg md:text-xl text-royal-brown/80 mb-8 font-body">
          Vereeuw uw trouwe metgezel als de edelman die hij altijd al was.
        </p>
        <div className="inline-block bg-royal-gold text-white font-body font-semibold px-8 py-4 rounded-lg text-lg">
          Binnenkort beschikbaar
        </div>
      </div>
    </main>
  );
}
