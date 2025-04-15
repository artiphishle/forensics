'use client';
import { t } from '@/i18n/i18n';
import Switch from '@/components/Switch';
import { useSettings } from '@/contexts/SettingsContext';
import { Download } from 'lucide-react';

export default function Settings() {
  const { showSubPackages, toggleShowSubPackages, showVendorPackages, toggleShowVendorPackages } =
    useSettings();

  return (
    <div className="p-4 md:pt-14 border-r bg-gray-100 border-r-gray-200 dark:border-r-gray-800">
      {/* Audit Download */}
      <div className="flex flex-row items-center">
        <Download size={8} className="mr-1" />
        <a className="text-xs" href="/api/audit/json" download>
          JSON
        </a>
        <span className="text-gray-200 dark:text-gray-800">|</span>
        <a className="text-xs" href="/api/audit/xml" download>
          XML
        </a>
      </div>
      {/* Whether to show sub packages */}
      {/*<h2>{t('settings.title')}</h2>*/}
      <Switch
        id="switch-show-sub-packages"
        label={t('settings.showSubPackages')}
        onToggle={() => {
          toggleShowSubPackages();
        }}
        value={showSubPackages}
      />
      {/* Whether to show vendor packages */}
      <Switch
        id="switch-show-vendor-packages"
        label={t('settings.showVendorPackages')}
        onToggle={() => {
          toggleShowVendorPackages();
        }}
        value={showVendorPackages}
      />
    </div>
  );
}
