/**
 * ScrollFloat — React Bits (https://reactbits.dev) · MIT License
 * Integrado y adaptado al branding de REY ACADEMY.
 */
import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollFloat.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollFloat = ({
  children,
  scrollContainerRef,
  as: Tag = 'h2',
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03
}) => {
  const containerRef = useRef(null);

  // Agrupado por palabra (con la clase "word" en white-space: nowrap) y no
  // por caracter suelto: antes cada letra quedaba como un span suelto sin
  // ningun lugar legitimo donde el navegador pudiera cortar la linea -
  // cuando el titulo no entraba en el ancho disponible, terminaba cortando
  // a mitad de palabra en cualquier letra. Agrupando los caracteres de cada
  // palabra en un contenedor que no se puede partir, y dejando un espacio
  // de verdad (cortable) ENTRE palabras, el salto de linea vuelve a caer
  // solo donde corresponde.
  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    const words = text.split(' ');
    const out = [];
    words.forEach((word, wordIndex) => {
      out.push(
        <span className="word" key={`w-${wordIndex}`}>
          {word.split('').map((char, charIndex) => (
            <span className="char" key={charIndex}>
              {char}
            </span>
          ))}
        </span>
      );
      if (wordIndex < words.length - 1) out.push(' ');
    });
    return out;
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    const charElements = el.querySelectorAll('.char');

    const tween = gsap.fromTo(
      charElements,
      {
        willChange: 'opacity, filter, transform',
        opacity: 0,
        filter: 'blur(10px)',
        yPercent: 120,
        scaleY: 2.3,
        scaleX: 0.7,
        transformOrigin: '50% 0%'
      },
      {
        duration: animationDuration,
        ease: ease,
        opacity: 1,
        filter: 'blur(0px)',
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        stagger: stagger,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: true
        }
      }
    );

    // Bug real: sin este cleanup, cada título quedaba con un ScrollTrigger
    // huérfano. En desarrollo, React StrictMode monta-desmonta-remonta cada
    // componente una vez a propósito (para detectar justo este tipo de fuga);
    // sin `.kill()` aquí, el primer ScrollTrigger nunca se destruía y el
    // segundo se creaba encima del mismo elemento — dos triggers con scrub
    // pisándose la animación del mismo texto, lo que hacía que algunos
    // títulos aparecieran ya resueltos o dejaran de reaccionar al scroll.
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger]);

  return (
    <Tag ref={containerRef} className={`scroll-float ${containerClassName}`}>
      <span className={`scroll-float-text ${textClassName}`}>{splitText}</span>
    </Tag>
  );
};

export default ScrollFloat;

