import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { OnboardingHeader } from '@/features/onboarding/OnboardingHeader';
import { useOnboarding } from '@/state/OnboardingContext';
import type { PersonalSection } from '@/types/onboarding';

type GenderOption = { value: PersonalSection['gender']; label: string };
const GENDERS: GenderOption[] = [
  { value: 'F', label: 'Female' },
  { value: 'M', label: 'Male' },
  { value: 'O', label: 'Other' },
];

const PAN_RE = /^[A-Z]{5}\d{4}[A-Z]$/;
const DOB_RE = /^\d{4}-\d{2}-\d{2}$/;

type FieldErrors = Partial<Record<keyof PersonalSection, string>>;

export default function PersonalDetailsScreen() {
  const { profile, setPersonal, setStep } = useOnboarding();
  const seed = profile.personal;
  const [fullName, setFullName] = useState(seed?.fullName ?? '');
  const [dob, setDob] = useState(seed?.dob ?? '');
  const [gender, setGender] = useState<PersonalSection['gender'] | undefined>(seed?.gender);
  const [city, setCity] = useState(seed?.city ?? '');
  const [pan, setPan] = useState(seed?.pan ?? '');
  const [aadharLast4, setAadharLast4] = useState(seed?.aadharLast4 ?? '');
  const [errors, setErrors] = useState<FieldErrors>({});

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (fullName.trim().length < 2) next.fullName = 'Enter your full name';
    if (!DOB_RE.test(dob)) next.dob = 'Use YYYY-MM-DD';
    if (!gender) next.gender = 'Pick one';
    if (city.trim().length < 2) next.city = 'Enter your city';
    if (!PAN_RE.test(pan)) next.pan = '10 chars like ABCDE1234F';
    if (!/^\d{4}$/.test(aadharLast4)) next.aadharLast4 = 'Last 4 digits';
    return next;
  };

  const onContinue = () => {
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setPersonal({
      fullName: fullName.trim(),
      dob,
      gender: gender!,
      city: city.trim(),
      pan: pan.toUpperCase(),
      aadharLast4,
    });
    setStep('family');
    router.push('/(onboarding)/family-details');
  };

  return (
    <ScreenContainer scroll edges={['top', 'bottom']} contentClassName="gap-stack-lg pb-stack-lg">
      <OnboardingHeader
        stepIndex={1}
        title="Personal details"
        subtitle="We need a few basics to set up your investor profile. Everything stays on this device."
        canGoBack={false}
      />

      <View className="gap-stack-md">
        <Input
          label="Full name (as per PAN)"
          placeholder="e.g. Ramesh Kumar"
          value={fullName}
          onChangeText={(v) => {
            setFullName(v);
            if (errors.fullName) setErrors({ ...errors, fullName: undefined });
          }}
          autoCapitalize="words"
          error={errors.fullName}
        />
        <Input
          label="Date of birth"
          placeholder="1990-05-12"
          value={dob}
          onChangeText={(v) => {
            setDob(v);
            if (errors.dob) setErrors({ ...errors, dob: undefined });
          }}
          autoCapitalize="none"
          autoCorrect={false}
          helper="Format: YYYY-MM-DD"
          error={errors.dob}
        />

        <View className="gap-1.5">
          <Text variant="label-caps" color="text-on-surface-variant">
            Gender
          </Text>
          <View className="flex-row gap-2">
            {GENDERS.map((g) => {
              const selected = gender === g.value;
              return (
                <Pressable
                  key={g.value}
                  onPress={() => {
                    setGender(g.value);
                    if (errors.gender) setErrors({ ...errors, gender: undefined });
                  }}
                  className={`flex-1 py-3 rounded-lg border items-center ${
                    selected
                      ? 'bg-secondary-container/30 border-secondary'
                      : 'bg-surface-container-low border-outline-variant/40'
                  }`}
                >
                  <Text
                    variant="body-md"
                    color={selected ? 'text-secondary' : 'text-on-surface-variant'}
                  >
                    {g.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {errors.gender ? (
            <Text variant="label-caps" color="text-error">
              {errors.gender}
            </Text>
          ) : null}
        </View>

        <Input
          label="City"
          placeholder="Bengaluru"
          value={city}
          onChangeText={(v) => {
            setCity(v);
            if (errors.city) setErrors({ ...errors, city: undefined });
          }}
          autoCapitalize="words"
          error={errors.city}
        />
        <Input
          label="PAN"
          placeholder="ABCDE1234F"
          value={pan}
          onChangeText={(v) => {
            setPan(v.toUpperCase());
            if (errors.pan) setErrors({ ...errors, pan: undefined });
          }}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={10}
          error={errors.pan}
        />
        <Input
          label="Aadhar — last 4 digits"
          placeholder="1234"
          value={aadharLast4}
          onChangeText={(v) => {
            setAadharLast4(v.replace(/\D/g, '').slice(0, 4));
            if (errors.aadharLast4) setErrors({ ...errors, aadharLast4: undefined });
          }}
          keyboardType="number-pad"
          maxLength={4}
          error={errors.aadharLast4}
        />
      </View>

      <View className="mt-stack-md">
        <Button label="Continue" onPress={onContinue} fullWidth trailingIcon="arrow_forward" />
      </View>
    </ScreenContainer>
  );
}
