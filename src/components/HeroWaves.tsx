import { useState } from 'react';
import Grainient from './react-bits/Grainient';

const colors = ['#101b65', '#273fe4', '#2a4cf5', '#587aff', '#aebbf3'];

export default function HeroWaves({ pauseLabel, resumeLabel }: { pauseLabel: string; resumeLabel: string }) {
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);

  return (
    <>
      <div className="hero-background" aria-hidden="true">
        <div className="hero-ribbon-shadow" />
        <div className="hero-ribbon" data-hero-ribbon>
          <Grainient
            colors={colors} angle={-20} bands={5} scale={0.85} flow={0.32} softness={0.68}
            silk={0.88} speed={paused ? 0 : 0.32} grainAmount={0} grainAnimated={false}
            interactive={false} clickSwirl={false} intro={false} dpr={1.25}
            onReady={() => setReady(true)}
          />
        </div>
      </div>
      <button
        type="button" className="waves-control" hidden={!ready}
        aria-label={paused ? resumeLabel : pauseLabel} onClick={() => setPaused(value => !value)}
      >
        <span aria-hidden="true">{paused ? '▶' : '❚❚'}</span>
      </button>
    </>
  );
}
