import React, { useEffect, useState } from 'react';
import heroImage from '../assets/meal-hero.png';
import spreadImage from '../assets/meal-spread.png';
import prepImage from '../assets/meal-prep.png';
import boxesImage from '../assets/meal-boxes.png';
import saladImage from '../assets/meal-salad.png';
import roastImage from '../assets/meal-roast.png';
import { ArrowRight, LogIn, Sparkles, Salad, HeartPulse, MapPin, Leaf } from 'lucide-react';

const mealPhotos = [heroImage, spreadImage, prepImage, boxesImage, saladImage, roastImage];

export const HomePage: React.FC<{ onProceed: () => void; onLogin: () => void }> = ({ onProceed, onLogin }) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setPhotoIndex(index => (index + 1) % mealPhotos.length), 4200); return () => window.clearInterval(timer); }, []);
  return <div className="home-page">
    <header className="home-header">
      <div className="home-brand"><span>
          <Salad size={22} />
        </span>SmartPlate</div>
      <button onClick={onLogin} className="home-signin"><LogIn size={17} /> Sign In</button>
    </header>
    <main><section className="home-hero"><div className="home-copy">
        <div className="home-eyebrow">
          <Sparkles size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Precision nutrition, made local
        </div>
        <h1>
          Eat well.<br /><span style={{ color: '#15803d' }}>Live better.</span>
        </h1>
        <p>
          Personalized Yangon meal programs built around your goals, budget, and favorite local ingredients.
        </p>
        <button
          onClick={onProceed}
          className="home-cta">
          Proceed to Plan Builder <ArrowRight size={19} />
        </button>
      </div><div className="meal-showcase">{mealPhotos.map((photo, index) => <img key={photo} src={photo} alt="Fresh NutriChef meal" className={index === photoIndex ? 'active' : ''} />)}<div className="meal-dots">{mealPhotos.map((_, index) => <button aria-label={`Show meal photo ${index + 1}`} key={index} onClick={() => setPhotoIndex(index)} className={index === photoIndex ? 'active' : ''} />)}</div></div></section>
      <section className="about-section"><div className="about-heading"><div className="home-eyebrow">THE NUTRICHEF PROMISE</div><h2>Good food, made <span>personal.</span></h2><p>A smarter way to eat in Yangon—thoughtful plans, local flavor, and support that fits real life.</p></div><div className="about-cards"><article><div className="about-icon"><HeartPulse size={22} /></div><h3>Built around you</h3><p>Your calories, preferences, allergies, and goals shape every plate—not the other way around.</p></article><article><div className="about-icon"><MapPin size={22} /></div><h3>Made for Yangon</h3><p>We pair precision nutrition with familiar local ingredients and dependable city delivery.</p></article><article><div className="about-icon"><Leaf size={22} /></div><h3>Fresh by design</h3><p>Chef-crafted variety keeps your week colorful, balanced, and genuinely enjoyable.</p></article></div></section>
    </main></div>;
};
