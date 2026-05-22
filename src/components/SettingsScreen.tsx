import { providerPresets } from '../lib/providerService'
import type { AppSettings, ProviderPresetId } from '../types'

interface SettingsScreenProps {
  settings: AppSettings
  onChange: (next: AppSettings) => void
  onFetchModels: () => void
  isFetchingModels: boolean
  modelsError: string | null
}

const textFields: Array<{ key: 'baseUrl' | 'apiKey' | 'model'; label: string }> = [
  { key: 'baseUrl', label: 'Base URL' },
  { key: 'apiKey', label: 'API key' },
  { key: 'model', label: 'Model' },
]

export function SettingsScreen({
  settings,
  onChange,
  onFetchModels,
  isFetchingModels,
  modelsError,
}: SettingsScreenProps) {
  const handleProviderChange = (provider: ProviderPresetId) => {
    const preset = providerPresets.find((item) => item.id === provider)
    if (!preset) return

    onChange({
      ...settings,
      provider,
      baseUrl: preset.defaultBaseUrl || settings.baseUrl,
    })
  }

  return (
    <section className="space-y-4 pb-28 pt-4">
      <div className="glass-panel rounded-3xl p-4 text-sm text-[#6B4B5B]">
        API keys stored in this browser are not hidden. Use only personal keys on trusted devices.
      </div>

      <label className="glass-panel block rounded-3xl p-4">
        <span className="mb-2 block text-sm font-medium text-[#513D4B]">Provider</span>
        <select
          value={settings.provider}
          onChange={(event) => handleProviderChange(event.target.value as ProviderPresetId)}
          className="input-base"
        >
          {providerPresets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </select>
      </label>

      {textFields.map((field) => (
        <label key={field.key} className="glass-panel block rounded-3xl p-4">
          <span className="mb-2 block text-sm font-medium text-[#513D4B]">{field.label}</span>
          <input
            type={field.key === 'apiKey' ? 'password' : 'text'}
            value={settings[field.key]}
            onChange={(event) => onChange({ ...settings, [field.key]: event.target.value })}
            className="input-base"
          />
        </label>
      ))}

      <label className="glass-panel block rounded-3xl p-4">
        <span className="mb-2 block text-sm font-medium text-[#513D4B]">System prompt</span>
        <textarea
          value={settings.systemPrompt}
          onChange={(event) => onChange({ ...settings, systemPrompt: event.target.value })}
          rows={4}
          className="input-base resize-y"
        />
      </label>

      <div className="glass-panel rounded-3xl p-4">
        <button
          type="button"
          onClick={onFetchModels}
          disabled={isFetchingModels}
          className="rounded-2xl bg-[#F9C5D5] px-4 py-2 text-sm font-medium text-[#4A2C3D] disabled:opacity-60"
        >
          {isFetchingModels ? 'Fetching models…' : 'Fetch models'}
        </button>
        {modelsError ? <p className="mt-2 text-sm text-[#8C2F39]">{modelsError}</p> : null}
      </div>
    </section>
  )
}
