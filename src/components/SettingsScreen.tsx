import type { AppSettings } from '../types'

interface SettingsScreenProps {
  settings: AppSettings
  onChange: (next: AppSettings) => void
}

const fields: Array<{ key: keyof AppSettings; label: string; multiline?: boolean }> = [
  { key: 'provider', label: 'Provider' },
  { key: 'baseUrl', label: 'Base URL' },
  { key: 'apiKey', label: 'API key' },
  { key: 'model', label: 'Model' },
  { key: 'systemPrompt', label: 'System prompt', multiline: true },
]

export function SettingsScreen({ settings, onChange }: SettingsScreenProps) {
  return (
    <section className="space-y-4 pb-28 pt-4">
      <div className="glass-panel rounded-3xl p-4 text-sm text-[#6B4B5B]">
        API keys stored in this browser are not hidden. Use only personal keys on trusted devices.
      </div>
      {fields.map((field) => (
        <label key={field.key} className="glass-panel block rounded-3xl p-4">
          <span className="mb-2 block text-sm font-medium text-[#513D4B]">{field.label}</span>
          {field.multiline ? (
            <textarea
              value={settings[field.key]}
              onChange={(event) => onChange({ ...settings, [field.key]: event.target.value })}
              rows={4}
              className="input-base resize-y"
            />
          ) : (
            <input
              type={field.key === 'apiKey' ? 'password' : 'text'}
              value={settings[field.key]}
              onChange={(event) => onChange({ ...settings, [field.key]: event.target.value })}
              className="input-base"
            />
          )}
        </label>
      ))}
    </section>
  )
}
