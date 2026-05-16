import { ScrollView, View, type ViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

const cx = (...p: Array<string | undefined | false>) => p.filter(Boolean).join(' ');

export type ScreenContainerProps = ViewProps & {
  scroll?: boolean;
  edges?: Edge[];
  contentClassName?: string;
  className?: string;
};

export function ScreenContainer({
  scroll = false,
  edges = ['top', 'bottom'],
  contentClassName,
  className,
  children,
  ...rest
}: ScreenContainerProps) {
  return (
    <SafeAreaView edges={edges} className={cx('flex-1 bg-background', className)}>
      {scroll ? (
        <ScrollView
          contentContainerClassName={cx('px-container-margin py-stack-md', contentClassName)}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View className={cx('flex-1 px-container-margin py-stack-md', contentClassName)} {...rest}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}
