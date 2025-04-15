import { t } from '@/i18n/i18n';
import Separator from '@/components/Separator';
import Switch from '@/components/Switch';
import { useSettings } from '@/contexts/SettingsContext';
import { Download } from 'lucide-react';

export default function Settings() {
  const { showSubPackages, toggleShowSubPackages, showVendorPackages, toggleShowVendorPackages } =
    useSettings();

  return (
    <div className="bg-background p-4">
      <h1>{t('settings.title')}</h1>

      {/* Whether to show sub packages */}
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

      <Separator />

      {/* Audit Download */}
      <h1>{t('settings.audit')}</h1>
      <a className="flex items-center gap-2" href="/api/audit/json" download>
        <Download /> JSON
      </a>
      <a className="flex items-center gap-2" href="/api/audit/xml" download>
        <Download /> XML
      </a>
    </div>
  );
}
