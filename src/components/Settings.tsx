'use client';
import React, { useState } from 'react';
import { t } from '@/i18n/i18n';
import Switch from '@/components/Switch';
import { useSettings } from '@/contexts/SettingsContext';
import { Download } from 'lucide-react';
import Setting from './Setting';

export default function Settings() {
  const [layout] = useState(process.env.NEXT_PUBLIC_SETTINGS_LAYOUT || 'grid');
  const { showSubPackages, toggleShowSubPackages, showVendorPackages, toggleShowVendorPackages } =
    useSettings();

  return (
    <div className="md:pt-14 border-r bg-neutral-100 border-r-neutral-200 dark:border-r-neutral-800 dark:bg-neutral-950">
      {/* Audit Download */}
      <h3>Download</h3>
      <div>
        <Setting>
          <a
            className="flex flex-row items-center content-start text-xs"
            href="/api/audit/json"
            download
          >
            <Download size={8} className="mr-1" />
            <span>JSON</span>
          </a>
        </Setting>
        <Setting>
          <a
            className="flex flex-row items-center content-start text-xs"
            href="/api/audit/xml"
            download
          >
            <Download size={8} className="mr-1" />
            <span>XML</span>
          </a>
        </Setting>
      </div>
      <h3>Filter</h3>
      <Setting>
        {/* Whether to show sub packages */}
        <Switch
          id="switch-show-sub-packages"
          label={t('settings.showSubPackages')}
          onToggle={() => {
            toggleShowSubPackages();
          }}
          value={showSubPackages}
        />
      </Setting>
      <Setting>
        {/* Whether to show vendor packages */}
        <Switch
          id="switch-show-vendor-packages"
          label={t('settings.showVendorPackages')}
          onToggle={() => {
            toggleShowVendorPackages();
          }}
          value={showVendorPackages}
        />
      </Setting>
      {/* Show selected layout style */}
      <h3>Layout</h3>
      <Setting>{layout}</Setting>
    </div>
  );
}
