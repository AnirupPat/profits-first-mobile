import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Icon } from '@/components/ui/Icon';
import { OnboardingHeader } from '@/features/onboarding/OnboardingHeader';
import { useOnboarding } from '@/state/OnboardingContext';
import type { ChildProfile, FamilySection } from '@/types/onboarding';

type ChildRow = { name: string; ageStr: string };

const toNum = (s: string) => (s.length === 0 ? undefined : Number(s));

export default function FamilyDetailsScreen() {
  const { profile, setFamily, setStep } = useOnboarding();
  const seed = profile.family;

  const [spouseSalaryStr, setSpouseSalaryStr] = useState(
    seed?.spouseSalary != null ? String(seed.spouseSalary) : '',
  );
  const [dependentsStr, setDependentsStr] = useState(
    seed?.dependents != null ? String(seed.dependents) : '',
  );
  const [children, setChildren] = useState<ChildRow[]>(
    seed?.children.length
      ? seed.children.map((c) => ({ name: c.name, ageStr: String(c.age) }))
      : [],
  );

  const addChild = () => setChildren((prev) => [...prev, { name: '', ageStr: '' }]);

  const removeChild = (idx: number) =>
    setChildren((prev) => prev.filter((_, i) => i !== idx));

  const updateChild = (idx: number, field: keyof ChildRow, value: string) =>
    setChildren((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c)),
    );

  const onContinue = () => {
    const validChildren: ChildProfile[] = children
      .filter((c) => c.name.trim().length > 0 && /^\d+$/.test(c.ageStr))
      .map((c) => ({ name: c.name.trim(), age: Number(c.ageStr) }));

    const section: FamilySection = {
      spouseSalary: toNum(spouseSalaryStr),
      dependents: toNum(dependentsStr),
      children: validChildren,
    };

    setFamily(section);
    setStep('financial');
    router.push('/(onboarding)/financial-details');
  };

  return (
    <ScreenContainer scroll edges={['top', 'bottom']} contentClassName="gap-stack-lg pb-stack-lg">
      <OnboardingHeader
        stepIndex={2}
        totalSteps={5}
        title="Family & dependents"
        subtitle="This helps us personalise your goal recommendations. All fields are optional — add what applies to you."
      />

      <View className="gap-stack-md">
        <CurrencyInput
          label="Spouse / partner monthly income"
          value={spouseSalaryStr}
          onChangeText={setSpouseSalaryStr}
          helper="Leave blank if not applicable."
        />

        <Input
          label="Total dependents"
          placeholder="e.g. 4"
          value={dependentsStr}
          onChangeText={(v) => setDependentsStr(v.replace(/\D/g, ''))}
          keyboardType="number-pad"
          helper="Include yourself, spouse, children, parents."
        />

        <View className="gap-stack-sm">
          <View className="flex-row items-center justify-between">
            <Text variant="label-caps" color="text-on-surface-variant">
              Children
            </Text>
            <Pressable
              onPress={addChild}
              className="flex-row items-center gap-1 py-1 px-2 rounded-lg bg-secondary-container/20 border border-secondary/30"
              hitSlop={8}
            >
              <Icon name="add" size={14} color="#99d4ae" />
              <Text variant="label-caps" color="text-secondary">
                Add child
              </Text>
            </Pressable>
          </View>

          {children.length === 0 ? (
            <View className="bg-surface-container-low rounded-xl border border-outline-variant/20 p-card-padding items-center gap-stack-sm">
              <Icon name="child-care" size={28} color="#5c5c69" />
              <Text variant="body-md" color="text-on-surface-variant" className="text-center">
                No children added yet. Tap "Add child" to include them.
              </Text>
            </View>
          ) : (
            <View className="gap-stack-sm">
              {children.map((child, idx) => (
                <View
                  key={idx}
                  className="bg-surface-container-low rounded-xl border border-outline-variant/20 p-card-padding gap-stack-sm"
                >
                  <View className="flex-row items-center justify-between mb-1">
                    <Text variant="label-caps" color="text-on-surface-variant">
                      Child {idx + 1}
                    </Text>
                    <Pressable
                      onPress={() => removeChild(idx)}
                      hitSlop={8}
                      className="p-1"
                    >
                      <Icon name="close" size={16} color="#909097" />
                    </Pressable>
                  </View>
                  <View className="flex-row gap-stack-sm">
                    <View className="flex-1">
                      <Input
                        label="Name"
                        placeholder="e.g. Arjun"
                        value={child.name}
                        onChangeText={(v) => updateChild(idx, 'name', v)}
                        autoCapitalize="words"
                      />
                    </View>
                    <View style={{ width: 96 }}>
                      <Input
                        label="Age"
                        placeholder="8"
                        value={child.ageStr}
                        onChangeText={(v) => updateChild(idx, 'ageStr', v.replace(/\D/g, '').slice(0, 2))}
                        keyboardType="number-pad"
                        maxLength={2}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      <View className="mt-stack-md">
        <Button label="Continue" onPress={onContinue} fullWidth trailingIcon="arrow_forward" />
      </View>
    </ScreenContainer>
  );
}
