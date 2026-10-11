import { AlertCircle } from 'lucide-react';

/**
 * Sélecteur de période (du / au) avec dates au format "YYYY-MM-DD".
 *
 * Props
 * - range         { from, to }                 valeurs contrôlées
 * - onRangeChange (r: {from, to}) => void      appelé à chaque modification
 * - allowEmpty    autorise des champs vides (filtres facultatifs)
 * - hideWarning   masque l'avertissement de période invalide
 * - labels        { from, to }                 libellés des champs
 * - hint          texte affiché sous les champs (ex. « 7 jours »)
 * - className     classes ajoutées au conteneur
 * - children      contrôles supplémentaires affichés sur la même ligne
 */

const pad = (n) => String(n).padStart(2, '0');
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const presets = () => {
  const today = new Date();
  const daysAgo = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return toISO(d);
  };
  return [
    { key: 'today', label: "Today", from: toISO(today), to: toISO(today) },
    { key: '7d', label: '7 days', from: daysAgo(6), to: toISO(today) },
    { key: '30d', label: '30 days', from: daysAgo(29), to: toISO(today) },
    {
      key: 'month',
      label: 'This month',
      from: toISO(new Date(today.getFullYear(), today.getMonth(), 1)),
      to: toISO(today),
    },
  ];
};

export default function DateRangePicker({
  range,
  onRangeChange,
  allowEmpty = false,
  hideWarning = false,
  labels,
  hint,
  className = '',
  children,
}) {
  const from = range?.from || '';
  const to = range?.to || '';
  const fromLabel = labels?.from || 'From';
  const toLabel = labels?.to || 'To';

  const emit = (next) => onRangeChange?.(next);

  const handleFrom = (value) => {
    if (!value && !allowEmpty) return;
    // Garde la période cohérente : si "du" dépasse "au", on aligne "au".
    const next = { from: value, to };
    if (value && to && value > to) next.to = value;
    emit(next);
  };

  const handleTo = (value) => {
    if (!value && !allowEmpty) return;
    const next = { from, to: value };
    if (value && from && value < from) next.from = value;
    emit(next);
  };

  const invalid = (!allowEmpty && (!from || !to)) || (from && to && from > to);

  const inputCls =
    'rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-red-500 focus:ring-red-500';
  const labelCls = 'block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1';

  return (
    <div className={className}>
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className={labelCls}>{fromLabel}</label>
          <input
            type="date"
            value={from}
            max={to || undefined}
            onChange={(e) => handleFrom(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>{toLabel}</label>
          <input
            type="date"
            value={to}
            min={from || undefined}
            onChange={(e) => handleTo(e.target.value)}
            className={inputCls}
          />
        </div>

        {children}

        <div className="flex flex-wrap gap-1.5 pb-0.5">
          {presets().map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => emit({ from: p.from, to: p.to })}
              className="px-2.5 py-1.5 rounded-full text-xs font-bold border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {p.label}
            </button>
          ))}
          {allowEmpty && (from || to) && (
            <button
              type="button"
              onClick={() => emit({ from: '', to: '' })}
              className="px-2.5 py-1.5 rounded-full text-xs font-bold border border-gray-300 bg-white text-red-600 hover:bg-red-50 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {hint && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}

      {invalid && !hideWarning && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-700">
          <AlertCircle size={14} /> Select a valid date range.
        </p>
      )}
    </div>
  );
}