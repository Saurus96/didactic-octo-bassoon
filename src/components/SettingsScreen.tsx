import { providerPresets } from '../lib/providerService'
import type { AppSettings, ProviderPresetId } from '../types'

interface SettingsScreenProps {
  settings: AppSettings
  onChange: (next: AppSettings) => void
  onFetchModels: () => void
  fetchedModels: string[]
  isFetchingModels: boolean
  modelsError: string | null
}

const textFields: Array<{ key: 'baseUrl' | 'apiKey'; label: string }> = [
  { key: 'baseUrl', label: 'Base URL' },
  { key: 'apiKey', label: 'API key' },
]

export function SettingsScreen({
  settings,
  onChange,
  onFetchModels,
  fetchedModels,
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
    <section className="space-y-3 pb-8 pt-1">

      <label className="glass-card glass-readable block rounded-3xl p-4">
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
        <label key={field.key} className="glass-card glass-readable block rounded-3xl p-4">
          <span className="mb-2 block text-sm font-medium text-[#513D4B]">{field.label}</span>
          <input
            type={field.key === 'apiKey' ? 'password' : 'text'}
            value={settings[field.key]}
            onChange={(event) => onChange({ ...settings, [field.key]: event.target.value })}
            className="input-base"
          />
        </label>
      ))}

      <label className="glass-card glass-readable block rounded-3xl p-4">
        <span className="mb-2 block text-sm font-medium text-[#513D4B]">Model</span>
        <input
          type="text"
          value={settings.model}
          onChange={(event) => onChange({ ...settings, model: event.target.value })}
          className="input-base"
          placeholder="Enter model ID"
        />
      </label>

      <label className="glass-card glass-readable block rounded-3xl p-4">
        <span className="mb-2 block text-sm font-medium text-[#513D4B]">Fetched models</span>
        <select
          value={fetchedModels.includes(settings.model) ? settings.model : ''}
          onChange={(event) => {
            if (!event.target.value) return
            onChange({ ...settings, model: event.target.value })
          }}
          className="input-base"
          disabled={fetchedModels.length === 0}
        >
          <option value="">{fetchedModels.length === 0 ? 'Fetch models to populate this list' : 'Select a fetched model'}</option>
          {fetchedModels.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </label>

      <label className="glass-card glass-readable block rounded-3xl p-4">
        <span className="mb-2 block text-sm font-medium text-[#513D4B]">System prompt</span>
        <textarea
          value={settings.systemPrompt}
          onChange={(event) => onChange({ ...settings, systemPrompt: event.target.value })}
          rows={4}
          className="input-base resize-y"
        />
      </label>

      <div className="glass-card glass-readable rounded-3xl p-4">
        <button
          type="button"
          onClick={onFetchModels}
          disabled={isFetchingModels}
          className="interactive h-11 rounded-2xl bg-[#F9C5D5] px-4 py-2 text-sm font-medium text-[#4A2C3D] disabled:opacity-60"
        >
          {isFetchingModels ? 'Fetching models…' : 'Fetch models'}
        </button>
        {modelsError ? <p className="mt-2 text-sm text-[#8C2F39]">{modelsError}</p> : null}
      </div>

      <p className="pt-4 text-xs italic text-[#6B4B5B]">
        Keys stored in this browser are not hidden. Use only personal keys on trusted devices.
      </p>
    </section>
  )
}
