import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Chip } from '@/components/ui/Chip';
import { OnboardingHeader } from '@/features/onboarding/OnboardingHeader';
import { useOnboarding } from '@/state/OnboardingContext';
import { DOCUMENT_CATALOG, isDocRequired } from '@/data/mockDocuments';
import type { DocSpec, DocStatus, SubmittedDoc } from '@/types/documents';

const ICON_FOR: Record<string, IconName> = {
  'aadhar-front': 'card-account-details-outline',
  'aadhar-back': 'card-account-details-outline',
  'pan-card': 'card-bulleted-outline',
  signature: 'draw',
  'bank-statement-6m': 'bank-outline',
  'salary-slips-3m': 'cash-multiple',
  'itr-2y': 'file-document-outline',
  'form-16': 'file-document-outline',
  'cas-cdsl-nsdl': 'chart-box-outline',
  'cancelled-cheque': 'checkbook',
};

const STATUS_LABEL: Record<DocStatus, string> = {
  'not-uploaded': 'Not uploaded',
  uploaded: 'Uploaded',
  verified: 'Verified',
};

const STATUS_TONE: Record<DocStatus, 'default' | 'info' | 'success'> = {
  'not-uploaded': 'default',
  uploaded: 'info',
  verified: 'success',
};

async function pickFile(spec: DocSpec): Promise<{ fileName: string } | null> {
  if (spec.accepts === 'pdf') {
    const res = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'text/csv'],
      multiple: false,
      copyToCacheDirectory: false,
    });
    if (res.canceled || !res.assets || res.assets.length === 0) return null;
    return { fileName: res.assets[0].name ?? 'document.pdf' };
  }
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: false,
    quality: 0.7,
  });
  if (res.canceled || !res.assets || res.assets.length === 0) return null;
  const asset = res.assets[0];
  return { fileName: asset.fileName ?? `${spec.id}.jpg` };
}

type RowProps = {
  spec: DocSpec;
  doc: SubmittedDoc;
  required: boolean;
  onUpload: () => void;
  busy: boolean;
};

function DocRow({ spec, doc, required, onUpload, busy }: RowProps) {
  return (
    <View className="bg-surface-container-low rounded-xl border border-outline-variant/20 p-card-padding gap-stack-md">
      <View className="flex-row items-start gap-stack-md">
        <View className="w-10 h-10 rounded-lg bg-surface-container-high items-center justify-center">
          <Icon name={ICON_FOR[spec.id] ?? 'file-document-outline'} size={20} color="#bec6e0" />
        </View>
        <View className="flex-1 gap-1">
          <Text variant="body-lg" color="text-on-surface">
            {spec.label}
          </Text>
          {spec.helper ? (
            <Text variant="label-caps" color="text-on-surface-variant">
              {spec.helper}
            </Text>
          ) : null}
        </View>
      </View>

      <View className="flex-row items-center gap-2 flex-wrap">
        <Chip
          label={required ? 'Required' : 'Optional'}
          tone={required ? 'warning' : 'default'}
        />
        <Chip label={STATUS_LABEL[doc.status]} tone={STATUS_TONE[doc.status]} />
        {doc.fileName ? (
          <Text variant="label-caps" color="text-on-surface-variant">
            {doc.fileName}
          </Text>
        ) : null}
      </View>

      <Button
        label={doc.status === 'not-uploaded' ? 'Upload' : 'Replace file'}
        variant={doc.status === 'not-uploaded' ? 'primary' : 'outline'}
        size="sm"
        onPress={onUpload}
        leadingIcon="upload"
        disabled={busy}
      />
    </View>
  );
}

const emptyItem = (specId: string): SubmittedDoc => ({ specId, status: 'not-uploaded' });

export default function DocumentsScreen() {
  const { profile, setDocuments, setStep } = useOnboarding();

  const [items, setItems] = useState<Record<string, SubmittedDoc>>(() => {
    const seed: Record<string, SubmittedDoc> = {};
    for (const spec of DOCUMENT_CATALOG) {
      const existing = profile.documents?.items.find((i) => i.specId === spec.id);
      seed[spec.id] = existing ?? emptyItem(spec.id);
    }
    return seed;
  });
  const [busyId, setBusyId] = useState<string | null>(null);
  const verifyTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    const timers = verifyTimers.current;
    return () => {
      Object.values(timers).forEach((t) => clearTimeout(t));
    };
  }, []);

  // Persist any in-progress upload state without advancing the step.
  useEffect(() => {
    setDocuments({ items: Object.values(items) });
  }, [items, setDocuments]);

  const onUpload = async (spec: DocSpec) => {
    setBusyId(spec.id);
    try {
      const picked = await pickFile(spec);
      if (!picked) return;
      const uploadedAt = new Date().toISOString();
      setItems((prev) => ({
        ...prev,
        [spec.id]: {
          specId: spec.id,
          status: 'uploaded',
          fileName: picked.fileName,
          uploadedAt,
        },
      }));
      if (verifyTimers.current[spec.id]) clearTimeout(verifyTimers.current[spec.id]);
      verifyTimers.current[spec.id] = setTimeout(() => {
        setItems((prev) => ({
          ...prev,
          [spec.id]: { ...prev[spec.id], status: 'verified' },
        }));
      }, 1200);
    } finally {
      setBusyId(null);
    }
  };

  const requiredMissing = useMemo(
    () =>
      DOCUMENT_CATALOG.filter(
        (s) => isDocRequired(s) && items[s.id]?.status === 'not-uploaded',
      ),
    [items],
  );
  const canContinue = requiredMissing.length === 0;

  const onContinue = () => {
    if (!canContinue) return;
    setDocuments({ items: Object.values(items) });
    setStep('done');
    router.push('/(onboarding)/done');
  };

  return (
    <ScreenContainer scroll edges={['top', 'bottom']} contentClassName="gap-stack-lg pb-stack-lg">
      <OnboardingHeader
        stepIndex={4}
        title="Documents"
        subtitle="Upload these to complete KYC. Required documents are needed to continue. Files stay on this device — nothing is sent to a server."
      />

      <View className="gap-stack-md">
        {DOCUMENT_CATALOG.map((spec) => (
          <DocRow
            key={spec.id}
            spec={spec}
            doc={items[spec.id] ?? emptyItem(spec.id)}
            required={isDocRequired(spec)}
            onUpload={() => onUpload(spec)}
            busy={busyId !== null}
          />
        ))}
      </View>

      {!canContinue ? (
        <View className="bg-surface-container/60 border border-outline-variant/30 rounded-lg p-stack-md flex-row items-start gap-stack-sm">
          <Icon name="info" size={18} color="#bec6e0" />
          <Text variant="body-md" color="text-on-surface-variant" className="flex-1">
            {requiredMissing.length} required document
            {requiredMissing.length === 1 ? '' : 's'} pending.
          </Text>
        </View>
      ) : null}

      <View className="mt-stack-md">
        <Button
          label="Continue"
          onPress={onContinue}
          disabled={!canContinue}
          fullWidth
          trailingIcon="arrow_forward"
        />
      </View>
    </ScreenContainer>
  );
}
