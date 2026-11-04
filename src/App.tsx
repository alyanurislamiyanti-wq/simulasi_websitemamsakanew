import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Programs from '@/components/Programs';
import Announcements from '@/components/Announcements';
import Gallery from '@/components/Gallery';
import Admission from '@/components/Admission';
import Footer from '@/components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Programs />
        <Announcements />
        <Gallery />
        <Admission />
      </main>
      <Footer />
    </div>
  );
}

export default App;
