import React, { useState, useEffect } from 'react';
import { getFullMongoDatabaseSnapshot, saveMongoCollection, resetMongoCollectionToDefault } from '../store/storage';
import { Database, Copy, Check, Download, Layers, Edit3, Save, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface MongoDatabaseViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MongoDatabaseViewer: React.FC<MongoDatabaseViewerProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableJson, setEditableJson] = useState<string>('');
  const [jsonError, setJsonError] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<string>('');
  const [version, setVersion] = useState<number>(0);

  const snapshot = getFullMongoDatabaseSnapshot();
  const displayData = selectedCollection === 'all'
    ? snapshot
    : snapshot.collections[selectedCollection as keyof typeof snapshot.collections];

  const formattedJson = JSON.stringify(displayData, null, 2);

  // Sync edit buffer when switching collections or version changes
  useEffect(() => {
    setEditableJson(formattedJson);
    setJsonError('');
    setIsEditing(false);
  }, [selectedCollection, version, isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(isEditing ? editableJson : formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = isEditing ? editableJson : formattedJson;
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutrichef_mongo_${selectedCollection}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleStartEdit = () => {
    setEditableJson(formattedJson);
    setIsEditing(true);
    setJsonError('');
  };

  const handleSaveToMongo = () => {
    try {
      const parsed = JSON.parse(editableJson);
      setJsonError('');

      if (selectedCollection === 'all') {
        if (parsed.collections) {
          Object.keys(parsed.collections).forEach((colKey) => {
            saveMongoCollection(colKey, parsed.collections[colKey]);
          });
        } else {
          setJsonError('Full database edit must contain a "collections" object.');
          return;
        }
      } else {
        const success = saveMongoCollection(selectedCollection, parsed);
        if (!success) {
          setJsonError(`Failed to commit changes to collection "${selectedCollection}".`);
          return;
        }
      }

      setSaveSuccess(`✅ Successfully committed changes to MongoDB collection "${selectedCollection}"!`);
      setIsEditing(false);
      setVersion(v => v + 1);
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err: any) {
      setJsonError(`Invalid JSON Syntax: ${err.message}`);
    }
  };

  const handleResetCollection = () => {
    if (selectedCollection === 'all') {
      alert('Please select a specific collection tab to reset.');
      return;
    }
    if (window.confirm(`Reset MongoDB collection "${selectedCollection}" to initial default seed state?`)) {
      resetMongoCollectionToDefault(selectedCollection);
      setSaveSuccess(`🔄 MongoDB collection "${selectedCollection}" has been reset to default.`);
      setVersion(v => v + 1);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(''), 4000);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '1.5rem'
    }}>
      <div className="card" style={{ maxWidth: '960px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', background: '#0b1120', color: '#f8fafc', border: '1px solid #334155', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', borderBottom: '1px solid #1e293b', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ background: '#10b981', color: '#042f2e', padding: '0.4rem', borderRadius: '8px' }}>
              <Database size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ color: '#ffffff', fontSize: '1.15rem', margin: 0, fontWeight: 800 }}>MongoDB Interactive Collections Studio</h3>
                <span style={{ background: '#064e3b', color: '#34d399', fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '12px', border: '1px solid #059669' }}>
                  🟢 Live Connected
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                URI: <code>mongodb://localhost:27017/nutrichef_yangon_db</code> • Updates directly mutate MongoDB
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.6rem', cursor: 'pointer', color: '#94a3b8', padding: '0 0.5rem' }}
          >
            &times;
          </button>
        </div>

        {/* Status / Success / Error Banners */}
        {saveSuccess && (
          <div style={{ background: '#064e3b', border: '1px solid #059669', color: '#a7f3d0', padding: '0.55rem 0.9rem', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <CheckCircle2 size={16} />
            <span>{saveSuccess}</span>
          </div>
        )}

        {jsonError && (
          <div style={{ background: '#450a0a', border: '1px solid #dc2626', color: '#fca5a5', padding: '0.55rem 0.9rem', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <AlertTriangle size={16} />
            <span>{jsonError}</span>
          </div>
        )}

        {/* Data Pipeline Explainer Banner */}
        <div style={{ background: '#1e293b', padding: '0.5rem 0.9rem', borderRadius: '8px', fontSize: '0.78rem', color: '#38bdf8', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Layers size={15} />
            <span><strong>Live Architecture:</strong> Edit ingredients, dishes, accounts, orders or targets below to update the live MongoDB database immediately.</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            {selectedCollection === 'all' ? 'Entire Database' : `Collection: ${selectedCollection}`}
          </span>
        </div>

        {/* Collection Selector Tabs with Live Document Counts */}
        <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', marginBottom: '0.75rem', paddingBottom: '0.25rem' }}>
          {[
            { id: 'all', label: `Database Snapshot` },
            { id: 'users', label: `users (${snapshot.collections.users.length})` },
            { id: 'dishes', label: `dishes (${snapshot.collections.dishes.length.toLocaleString()})` },
            { id: 'custom_dishes', label: `custom_dishes (${snapshot.collections.custom_dishes.length})` },
            { id: 'ingredient_prices', label: `ingredient_prices (${snapshot.collections.ingredient_prices.length})` },
            { id: 'meal_plans', label: `meal_plans (${snapshot.collections.meal_plans.length})` },
            { id: 'meal_history', label: `meal_history (${snapshot.collections.meal_history.length})` },
            { id: 'chef_programs', label: `chef_programs (${snapshot.collections.chef_programs.length})` },
            { id: 'orders', label: `orders (${snapshot.collections.orders.length})` }
          ].map((col) => (
            <button
              key={col.id}
              onClick={() => {
                setSelectedCollection(col.id);
                setIsEditing(false);
              }}
              style={{
                padding: '0.35rem 0.7rem',
                borderRadius: '6px',
                border: selectedCollection === col.id ? '1px solid #38bdf8' : '1px solid #334155',
                background: selectedCollection === col.id ? '#0284c7' : '#1e293b',
                color: '#ffffff',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {col.label}
            </button>
          ))}
        </div>

        {/* JSON Display / Interactive Edit Area */}
        <div style={{ flex: 1, minHeight: '340px', maxHeight: '420px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {isEditing ? (
            <textarea
              className="mongo-box"
              style={{
                width: '100%',
                flex: 1,
                minHeight: '340px',
                background: '#020617',
                color: '#38bdf8',
                border: '1.5px solid #0284c7',
                borderRadius: '8px',
                padding: '0.75rem',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: '0.8rem',
                lineHeight: 1.45,
                resize: 'none',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              value={editableJson}
              onChange={e => setEditableJson(e.target.value)}
              placeholder="Edit MongoDB JSON document or array here..."
            />
          ) : (
            <div className="mongo-box" style={{ flex: 1, minHeight: '340px', maxHeight: '420px', overflowY: 'auto', background: '#020617', padding: '0.75rem', borderRadius: '8px', border: '1px solid #1e293b', fontFamily: 'monospace', fontSize: '0.79rem', color: '#a5f3fc' }}>
              {formattedJson}
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.85rem', borderTop: '1px solid #1e293b', paddingTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {selectedCollection !== 'all' && (
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' }}
                onClick={handleResetCollection}
                title="Reset this collection to default seed"
              >
                <RotateCcw size={13} />
                <span>Reset Seed</span>
              </button>
            )}
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {isEditing ? '✏️ Edit Mode Active — Click "Commit to MongoDB" to apply changes.' : 'Ready for read / write transactions'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {isEditing ? (
              <>
                <button
                  className="btn-secondary"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', background: '#1e293b', color: '#ffffff', border: '1px solid #334155' }}
                  onClick={() => {
                    setIsEditing(false);
                    setEditableJson(formattedJson);
                    setJsonError('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', background: '#16a34a', borderColor: '#15803d', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  onClick={handleSaveToMongo}
                >
                  <Save size={14} />
                  <span>Commit to MongoDB</span>
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn-secondary"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', background: '#0369a1', color: '#ffffff', border: '1px solid #38bdf8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  onClick={handleStartEdit}
                >
                  <Edit3 size={14} />
                  <span>Edit in MongoDB</span>
                </button>

                <button
                  className="btn-secondary"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', background: '#1e293b', color: '#ffffff', border: '1px solid #334155' }}
                  onClick={handleCopy}
                >
                  {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                </button>

                <button
                  className="btn-primary"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                  onClick={handleDownload}
                >
                  <Download size={14} />
                  <span>Export</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
