
import React, { useState } from 'react';
import { MarketingContent } from '../types';
import { WhatsappIcon } from './icons/WhatsappIcon';
import { TelegramIcon } from './icons/TelegramIcon';
import { MailIcon } from './icons/MailIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { ShareIcon } from './icons/ShareIcon';
import { CheckIcon } from './icons/CheckIcon';

interface ShareButtonsProps {
  content: MarketingContent;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const { title, description, story, hashtags } = content;

  const shareText = `${title}\n\n${description}`;
  const emailBody = `${description}\n\n${story}\n\n`;
  const instagramCaption = `${description}\n\n${hashtags.join(' ')}`;

  const handleCopyForInstagram = () => {
    navigator.clipboard.writeText(instagramCaption).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleGenericShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: shareText,
      }).catch((error) => console.log('Error sharing:', error));
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-stone-200 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <a
                href={`whatsapp://send?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 font-semibold rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                aria-label="Share on WhatsApp"
            >
                <WhatsappIcon className="w-5 h-5" />
                <span>WhatsApp</span>
            </a>

            <a
                href={`https://t.me/share/url?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-sky-50 text-sky-700 font-semibold rounded-lg border border-sky-200 hover:bg-sky-100 transition-colors"
                aria-label="Share on Telegram"
            >
                <TelegramIcon className="w-5 h-5" />
                <span>Telegram</span>
            </a>

            <a
                href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(emailBody)}`}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 font-semibold rounded-lg border border-stone-200 hover:bg-stone-200 transition-colors"
                aria-label="Share via Email"
            >
                <MailIcon className="w-5 h-5" />
                <span>Email</span>
            </a>
            
            <button
                onClick={handleCopyForInstagram}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-pink-50 text-pink-700 font-semibold rounded-lg border border-pink-200 hover:bg-pink-100 transition-colors"
                aria-label="Copy caption for Instagram"
            >
                {copied ? <CheckIcon className="w-5 h-5" /> : <InstagramIcon className="w-5 h-5" />}
                <span>{copied ? 'Copied!' : 'Instagram'}</span>
            </button>

            {navigator.share && (
                <button
                    onClick={handleGenericShare}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors"
                    aria-label="More sharing options"
                >
                    <ShareIcon className="w-5 h-5" />
                    <span>More...</span>
                </button>
            )}
        </div>
    </div>
  );
};