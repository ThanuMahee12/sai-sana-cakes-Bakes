function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-text-primary mb-4">
          Sai Sana Cakes & Bakes
        </h1>
        <p className="text-lg font-sans text-text-primary/70 mb-6">
          Delicious cakes made with love
        </p>
        <button className="px-8 py-3 bg-primary text-text-primary rounded-lg shadow-lg hover:bg-primary-400 transition-colors duration-300">
          Explore Our Menu
        </button>
      </div>
    </div>
  );
}

export default App;
