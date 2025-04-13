import { t } from '@/i18n/i18n';
import Switch from '@/components/Switch';
import { useSettings } from '@/contexts/SettingsContext';

export default function Settings() {
  const { showSubPackages, toggleShowSubPackages } = useSettings();

  return (
    <div className="bg-background p-4">
      <h1 className="font-bold text-xl text-foreground mb-4">{t('settings.title')}</h1>
      <Switch
        id="switch-show-subs"
        label={t('settings.showSubPackages')}
        onToggle={() => toggleShowSubPackages()}
        value={showSubPackages}
      />
    </div>
  );
}
