import { Component, OnInit, Inject, PLATFORM_ID, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';

declare var AOS: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit, AfterViewInit {
  currentLang: 'en' | 'ar' = 'ar';
  showOverlay = true;

  countdown = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  private targetDate = new Date('July 28, 2026 20:00:00').getTime();
  private countdownInterval: any;
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      // Auto-detect language
      const userLang = navigator.language || (navigator as any).userLanguage;
      this.currentLang = userLang.toLowerCase().startsWith('ar') ? 'ar' : 'en';
      this.updateHtmlLangDir();

      this.startCountdown();

      window.addEventListener('load', () => {
        if (typeof AOS !== 'undefined') {
          AOS.refresh();
        }
      });
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      if (typeof AOS !== 'undefined') {
        AOS.init({
          duration: 1000,
          once: true,
          offset: 50
        });
      }
    }
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.updateHtmlLangDir();
  }

  private updateHtmlLangDir() {
    if (this.isBrowser) {
      const htmlElement = document.documentElement;
      htmlElement.setAttribute('lang', this.currentLang);
      htmlElement.setAttribute('dir', this.currentLang === 'en' ? 'ltr' : 'rtl');
    }
  }

  openInvitation() {
    this.showOverlay = false;
    if (this.isBrowser) {
      setTimeout(() => {
        if (typeof AOS !== 'undefined') {
          AOS.refresh();
        }
      }, 100);

      const quranAudio = document.getElementById('quran-audio') as HTMLAudioElement;
      if (quranAudio) {
        quranAudio.play().catch(error => console.log('Audio playback prevented by browser policy', error));
      }
    }
  }

  private startCountdown() {
    this.updateCountdown();
    if (this.isBrowser) {
      this.countdownInterval = setInterval(() => {
        this.updateCountdown();
        this.cdr.detectChanges();
      }, 1000);
    }
  }

  private updateCountdown() {
    const now = new Date().getTime();
    const distance = this.targetDate - now;

    if (distance < 0) {
      this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      if (this.countdownInterval) clearInterval(this.countdownInterval);
      return;
    }

    this.countdown.days = Math.floor(distance / (1000 * 60 * 60 * 24));
    this.countdown.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.countdown.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    this.countdown.seconds = Math.floor((distance % (1000 * 60)) / 1000);
  }
}
