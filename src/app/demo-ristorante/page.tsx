'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Instagram, Facebook, Utensils, Anchor, Star } from 'lucide-react';

export default function DemoRistorante() {
    return (
        <div style={{ fontFamily: '"Inter", sans-serif', backgroundColor: '#f8fafc', color: '#1e293b', overflowX: 'hidden' }}>
            
            {/* HERO SECTION */}
            <section style={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'url("https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(2px)'
                }}></div>

                <div style={{
                    position: 'relative',
                    zIndex: 10,
                    textAlign: 'center',
                    padding: '0 20px',
                    maxWidth: '800px'
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 style={{ 
                            color: '#0d9488', 
                            fontSize: '1.2rem', 
                            fontWeight: 'bold', 
                            textTransform: 'uppercase', 
                            letterSpacing: '3px',
                            marginBottom: '1rem'
                        }}>
                            Gusto & Tradizione
                        </h2>
                        <h1 style={{ 
                            fontSize: '4.5rem', 
                            fontWeight: '900', 
                            color: '#0f172a', 
                            marginBottom: '1.5rem',
                            lineHeight: '1.1',
                            fontFamily: '"Playfair Display", serif'
                        }}>
                            Aperifish XL
                        </h1>
                        <p style={{ 
                            fontSize: '1.2rem', 
                            color: '#475569', 
                            marginBottom: '2.5rem',
                            lineHeight: '1.6'
                        }}>
                            Vivi l'autentica esperienza del mare. Pesce freschissimo, crudi d'eccellenza e un'atmosfera indimenticabile, direttamente nel cuore della città.
                        </p>
                        
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/book/aperifish-xl-drink-e-wine-733-solo" style={{
                                backgroundColor: '#f59e0b',
                                color: 'white',
                                padding: '15px 35px',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                boxShadow: '0 10px 25px rgba(245, 158, 11, 0.4)',
                                transition: 'transform 0.3s'
                            }}>
                                Prenota un Tavolo
                            </Link>
                            <Link href="/menu/aperifish-xl-drink-e-wine-733-solo" style={{
                                backgroundColor: 'transparent',
                                color: '#0d9488',
                                padding: '15px 35px',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                border: '2px solid #0d9488',
                                transition: 'background-color 0.3s'
                            }}>
                                Guarda il Menu
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ABOUT SECTION */}
            <section style={{ padding: '6rem 20px', backgroundColor: '#ffffff', textAlign: 'center' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <Anchor size={40} color="#0d9488" style={{ margin: '0 auto 1.5rem auto' }} />
                    <h2 style={{ fontSize: '2.5rem', fontFamily: '"Playfair Display", serif', color: '#0f172a', marginBottom: '1.5rem' }}>
                        Dal mare alla tavola, ogni giorno.
                    </h2>
                    <div style={{ height: '3px', width: '60px', backgroundColor: '#f59e0b', margin: '0 auto 2rem auto' }}></div>
                    <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: '1.8' }}>
                        Selezioniamo personalmente il pescato del giorno per garantirti sempre la massima qualità.
                        Che si tratti di un crudo raffinato o di un primo piatto tradizionale, ogni nostra creazione
                        è pensata per esaltare i sapori autentici del Mediterraneo in un ambiente moderno ed accogliente.
                    </p>
                </div>
            </section>

            {/* GALLERY HIGHLIGHTS */}
            <section style={{ padding: '6rem 20px', backgroundColor: '#f0fdfa' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontFamily: '"Playfair Display", serif', color: '#0f172a' }}>I Nostri Crudi</h2>
                        <p style={{ color: '#0d9488', fontSize: '1.1rem', marginTop: '0.5rem' }}>Freschezza assoluta, sapore unico</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Card 1 */}
                        <div style={{ borderRadius: '20px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                            <img src="https://images.unsplash.com/photo-1534080564583-6be75777b70a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Crudo di mare" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                            <div style={{ padding: '2rem' }}>
                                <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '0.5rem', fontFamily: '"Playfair Display", serif' }}>Plateau Royal</h3>
                                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Una selezione pregiata di ostriche, gamberi rossi e scampi, servita sul ghiaccio.</p>
                                <span style={{ fontWeight: 'bold', color: '#0d9488', fontSize: '1.2rem' }}>Da 35€</span>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div style={{ borderRadius: '20px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                            <img src="https://images.unsplash.com/photo-1565557613262-c8bf64f691eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Tartare" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                            <div style={{ padding: '2rem' }}>
                                <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '0.5rem', fontFamily: '"Playfair Display", serif' }}>Tartare di Tonno</h3>
                                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Tonno rosso battuto al coltello, avocado, stracciatella e granella di pistacchio.</p>
                                <span style={{ fontWeight: 'bold', color: '#0d9488', fontSize: '1.2rem' }}>Da 18€</span>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div style={{ borderRadius: '20px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                            <img src="https://images.unsplash.com/photo-1559742811-822873691df8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Carpaccio" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                            <div style={{ padding: '2rem' }}>
                                <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '0.5rem', fontFamily: '"Playfair Display", serif' }}>Carpaccio di Salmone</h3>
                                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Salmone fresco marinato agli agrumi con pepe rosa e ciuffi di finocchietto.</p>
                                <span style={{ fontWeight: 'bold', color: '#0d9488', fontSize: '1.2rem' }}>Da 16€</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                        <Link href="/menu/aperifish-xl-drink-e-wine-733-solo" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            backgroundColor: '#0f172a',
                            color: 'white',
                            padding: '15px 40px',
                            borderRadius: '50px',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            boxShadow: '0 10px 20px rgba(15, 23, 42, 0.2)'
                        }}>
                            <Utensils size={20} />
                            Sfoglia tutto il Menu Digitale
                        </Link>
                    </div>
                </div>
            </section>

            {/* INFO & FOOTER */}
            <footer style={{ backgroundColor: '#0f172a', color: 'white', padding: '5rem 20px 2rem 20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.8rem', fontFamily: '"Playfair Display", serif', marginBottom: '1.5rem', color: '#5eead4' }}>Aperifish XL</h3>
                        <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                            La tua oasi di freschezza in città. Prenota un tavolo per vivere un'esperienza culinaria unica, tra mare e passione.
                        </p>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <a href="#" style={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '50%' }}><Facebook size={20} /></a>
                            <a href="#" style={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '50%' }}><Instagram size={20} /></a>
                        </div>
                    </div>
                    
                    <div>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#cbd5e1' }}>Contatti</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <MapPin size={18} color="#5eead4" />
                                Via del Mare 123, Roma
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Phone size={18} color="#5eead4" />
                                +39 06 1234 5678
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Clock size={18} color="#5eead4" />
                                Mar - Dom: 18:00 - 02:00
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#cbd5e1' }}>Vieni a trovarci</h4>
                        <Link href="/book/aperifish-xl-drink-e-wine-733-solo" style={{
                            display: 'inline-block',
                            backgroundColor: '#f59e0b',
                            color: 'white',
                            padding: '12px 25px',
                            borderRadius: '5px',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            width: '100%'
                        }}>
                            Prenota il tuo tavolo
                        </Link>
                    </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                    &copy; {new Date().getFullYear()} Aperifish XL. Realizzato da Gardigital.
                </div>
            </footer>
        </div>
    );
}
