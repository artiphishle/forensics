import { t } from '@/i18n/i18n';
import Separator from '@/components/Separator';
import Switch from '@/components/Switch';
import { useSettings } from '@/contexts/SettingsContext';

export default function Settings() {
  const { showSubPackages, toggleShowSubPackages, showVendorPackages, toggleShowVendorPackages } =
    useSettings();

  return (
    <div className="bg-background p-4">
      <h1 className="font-bold text-xl text-foreground mb-4">{t('settings.title')}</h1>

      <Separator />

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
    </div>
  );
}
