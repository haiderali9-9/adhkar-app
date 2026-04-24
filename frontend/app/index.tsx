import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

type ApkInfo = {
  available: boolean;
  filename?: string;
  size_mb?: number;
  app_id?: string;
  app_name?: string;
  download_url?: string;
};

export default function Index() {
  const [info, setInfo] = useState<ApkInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/download/apk/info`);
        const data = await res.json();
        setInfo(data);
      } catch (_e) {
        setInfo({ available: false });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDownload = async () => {
    if (!info?.download_url) return;
    const url = `${BACKEND_URL}${info.download_url}`;
    setDownloading(true);
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Unable to open download link", url);
      }
    } catch (_e) {
      Alert.alert("Download failed", "Please try again.");
    } finally {
      setTimeout(() => setDownloading(false), 1200);
    }
  };

  return (
    <SafeAreaView style={styles.safe} testID="apk-landing-screen">
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoWrap} testID="app-logo">
          <Text style={styles.logoArabic}>سكينة</Text>
        </View>

        <Text style={styles.kicker} testID="app-kicker">
          PEACEFUL REMEMBRANCE
        </Text>
        <Text style={styles.title} testID="app-title">
          Sakeenah
        </Text>
        <Text style={styles.subtitle} testID="app-subtitle">
          Your daily Islamic adhkar companion — morning, evening, after salah
          and sleep remembrance with streaks and gentle reminders.
        </Text>

        <View style={styles.card} testID="apk-card">
          <View style={styles.cardHeader}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>ANDROID APK</Text>
            </View>
            <Text style={styles.cardTitle}>Ready to install</Text>
          </View>

          {loading ? (
            <ActivityIndicator color="#d4af5f" style={{ marginVertical: 20 }} />
          ) : info?.available ? (
            <View>
              <Row label="App" value={info.app_name || "Sakeenah"} />
              <Row label="Package" value={info.app_id || "—"} />
              <Row label="File" value={info.filename || "app.apk"} />
              <Row label="Size" value={`${info.size_mb ?? "?"} MB`} />
              <Row label="Min SDK" value="Android 6.0+" />

              <TouchableOpacity
                testID="download-apk-btn"
                onPress={handleDownload}
                activeOpacity={0.85}
                style={[
                  styles.downloadBtn,
                  downloading && styles.downloadBtnDisabled,
                ]}
                disabled={downloading}
              >
                {downloading ? (
                  <ActivityIndicator color="#0d3a2a" />
                ) : (
                  <Text style={styles.downloadBtnText}>Download APK</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.hint} testID="install-hint">
                After download, open the file on your Android device. You may
                need to allow installs from unknown sources.
              </Text>
            </View>
          ) : (
            <Text style={styles.errorText} testID="apk-error">
              APK not yet available.
            </Text>
          )}
        </View>

        <View style={styles.featuresCard} testID="features-card">
          <Text style={styles.featuresTitle}>What&apos;s inside</Text>
          <Feature text="Morning, evening, after-salah & sleep adhkar" />
          <Feature text="Progress tracking with daily streaks" />
          <Feature text="Favorites & offline-first storage" />
          <Feature text="Beautiful Arabic typography (Amiri font)" />
          <Feature text="Light & dark calming themes" />
        </View>

        <Text style={styles.footer} testID="footer-text">
          Built with Capacitor · Runs on Android {Platform.OS === "ios" ? "" : ""}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.bullet} />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0d2620",
  },
  container: {
    padding: 24,
    paddingBottom: 48,
    alignItems: "stretch",
  },
  logoWrap: {
    alignSelf: "center",
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#0d3a2a",
    borderWidth: 1,
    borderColor: "#d4af5f",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 20,
  },
  logoArabic: {
    color: "#d4af5f",
    fontSize: 32,
    fontWeight: "600",
  },
  kicker: {
    alignSelf: "center",
    color: "#d4af5f",
    fontSize: 11,
    letterSpacing: 3,
    marginBottom: 6,
  },
  title: {
    alignSelf: "center",
    color: "#f4ead5",
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 10,
  },
  subtitle: {
    color: "#c7d6cf",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: "#113a2c",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 95, 0.25)",
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  badge: {
    backgroundColor: "#d4af5f",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: "#0d3a2a",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  cardTitle: {
    color: "#f4ead5",
    fontSize: 14,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(244,234,213,0.1)",
  },
  rowLabel: {
    color: "#9bb0a6",
    fontSize: 13,
  },
  rowValue: {
    color: "#f4ead5",
    fontSize: 13,
    fontWeight: "500",
    maxWidth: "60%",
    textAlign: "right",
  },
  downloadBtn: {
    marginTop: 18,
    backgroundColor: "#d4af5f",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  downloadBtnDisabled: {
    opacity: 0.7,
  },
  downloadBtnText: {
    color: "#0d3a2a",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  hint: {
    color: "#9bb0a6",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 12,
    textAlign: "center",
  },
  errorText: {
    color: "#e6a1a1",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 16,
  },
  featuresCard: {
    backgroundColor: "rgba(244,234,213,0.04)",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(244,234,213,0.08)",
  },
  featuresTitle: {
    color: "#f4ead5",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#d4af5f",
    marginRight: 12,
  },
  featureText: {
    color: "#c7d6cf",
    fontSize: 13,
    flex: 1,
  },
  footer: {
    color: "#6f8078",
    fontSize: 11,
    textAlign: "center",
    marginTop: 22,
    letterSpacing: 0.5,
  },
});
