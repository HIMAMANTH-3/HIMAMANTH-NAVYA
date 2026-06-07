/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TimelineItem {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
}

export interface LoveReason {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon identifier
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
}

export interface BirthdayWebsiteData {
  girlfriendName: string;
  birthdate: string; // ISO date string YYYY-MM-DD
  coupleName: string; // e.g. "Alex & Mary"
  mainGreetingTitle: string;
  mainGreetingSub: string;
  loveLetterText: string;
  timeline: TimelineItem[];
  reasons: LoveReason[];
  gallery: GalleryItem[];
  giftBoxRevealMessage: string;
  musicTrackUrl: string; // Audio file URL
  musicTrackTitle: string;
  musicArtistName: string;
}
