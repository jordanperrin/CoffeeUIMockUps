import { Feather } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInLeft,
  FadeInUp,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Polygon, Circle as SvgCircle } from "react-native-svg";

// --- Types & Constants ---

type ShopTag =
  | "Laptop Friendly"
  | "Patio"
  | "Bakery"
  | "Busy"
  | "Food"
  | "Queue"
  | "No Laptops"
  | "Strict"
  | "Aussie";

interface CoffeeShop {
  id: string;
  rank: string;
  name: string;
  address: string;
  specialty: string;
  tags: ShopTag[];
  rating: number;
  shape: "star" | "blob2" | "blob" | "circle";
}

const COFFEE_SHOPS: CoffeeShop[] = [
  {
    id: "1",
    rank: "01",
    name: "Bonanza Roastery",
    address: "Adalbertstraße 70",
    specialty: "Espresso",
    tags: ["Laptop Friendly", "Patio"],
    rating: 9.8,
    shape: "star",
  },
  {
    id: "2",
    rank: "02",
    name: "Five Elephant",
    address: "Reichenberger Str.",
    specialty: "Cheesecake",
    tags: ["Bakery", "Busy"],
    rating: 9.5,
    shape: "blob2",
  },
  {
    id: "3",
    rank: "03",
    name: "Distrikt Coffee",
    address: "Bergstraße 68",
    specialty: "Brunch",
    tags: ["Food", "Queue"],
    rating: 9.2,
    shape: "blob",
  },
  {
    id: "4",
    rank: "04",
    name: "The Barn",
    address: "Auguststraße 58",
    specialty: "Filter",
    tags: ["No Laptops", "Strict"],
    rating: 8.9,
    shape: "circle",
  },
  {
    id: "5",
    rank: "05",
    name: "Silo Coffee",
    address: "Gabriel-Max-Str. 4",
    specialty: "Aussie",
    tags: ["Aussie"],
    rating: 8.7,
    shape: "circle",
  },
];

// --- Sub-components ---

const RatingShape = ({
  shape,
  score,
}: {
  shape: CoffeeShop["shape"];
  score: number;
}) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (shape === "star") {
      rotation.value = withRepeat(
        withTiming(360, { duration: 10000 }),
        -1,
        false,
      );
    }
  }, [shape]);

  const starStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const SIZE = 40;
  const STAR_SIZE = 65

  const renderShape = () => {
    switch (shape) {
      case "star":
        return (
          <Animated.View style={[{ width: STAR_SIZE, height: STAR_SIZE }, starStyle]}>
            <Svg width={STAR_SIZE} height={STAR_SIZE} viewBox="0 0 100 100">
              <Polygon
                points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35"
                fill="#FF5A36"
              />
            </Svg>
          </Animated.View>
        );
      case "blob2":
        return (
          <View style={{ width: SIZE, height: SIZE }}>
            <Svg width={SIZE} height={SIZE} viewBox="0 0 100 100">
              <Path
                d="M45,2 C65,0 85,10 95,30 C105,50 95,75 80,90 C60,105 35,100 18,85 C0,68 -5,42 10,22 C22,6 35,3 45,2 Z"
                fill="#2E9BC7"
              />
            </Svg>
          </View>
        );
      case "blob":
        return (
          <View style={{ width: SIZE, height: SIZE }}>
            <Svg width={SIZE} height={SIZE} viewBox="0 0 100 100">
              <Path
                d="M50,5 C70,2 90,15 93,35 C96,55 88,70 78,82 C65,95 45,98 28,88 C12,78 2,60 5,40 C8,20 30,8 50,5 Z"
                fill="#FFFFFF"
              />
            </Svg>
          </View>
        );
      default:
        return (
          <View style={{ width: SIZE, height: SIZE }}>
            <Svg width={SIZE} height={SIZE} viewBox="0 0 100 100">
              <SvgCircle cx="50" cy="50" r="48" fill="rgba(0,0,0,0.1)" />
            </Svg>
          </View>
        );
    }
  };

  const textColor =
    shape === "blob"
      ? "#000000"
      : shape === "circle"
        ? "rgba(0,0,0,0.6)"
        : "#FFFFFF";

  const containerSize = shape === "star" ? STAR_SIZE : SIZE;

  return (
    <View style={[s.ratingContainer, { width: containerSize, height: containerSize }]}>
      <View style={s.ratingShapeOverlay}>{renderShape()}</View>
      <Text style={[s.ratingText, { color: textColor }]}>
        {score.toFixed(1)}
      </Text>
    </View>
  );
};

// --- Shop List Item ---

const ShopItem = ({ shop, index }: { shop: CoffeeShop; index: number }) => {
  return (
    <Animated.View entering={FadeInLeft.delay(index * 100).duration(400)}>
      <Pressable
        onPress={() => {}}
        style={({ pressed }) => [
          s.shopItemBase,
          index === 0 && s.shopItemFirst,
          { backgroundColor: pressed ? "rgba(255,255,255,0.4)" : "transparent" },
        ]}
      >
        <Text style={[s.shopRank, { letterSpacing: -1 }]}>
          {shop.rank}
        </Text>

        <View style={s.shopInfo}>
          <Text style={[s.shopName, { lineHeight: 24, letterSpacing: -0.5 }]}>
            {shop.name}
          </Text>
          <View style={s.shopDetailsRow}>
            <Text style={[s.shopDetailText, { opacity: 0.7 }]}>
              {shop.address}
            </Text>
            <Text style={{ opacity: 0.7 }}>{"•"}</Text>
            <Text style={[s.shopSpecialty, { opacity: 0.7 }]}>
              {shop.specialty}
            </Text>
          </View>

          <View style={s.tagsRow}>
            {shop.tags.map((tag) => (
              <View key={tag} style={s.tag}>
                <Text style={{ fontSize: 11 }}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.shopRight}>
          <RatingShape shape={shop.shape} score={shop.rating} />
          <Feather name="chevron-right" size={18} color="rgba(0,0,0,0.2)" />
        </View>
      </Pressable>
    </Animated.View>
  );
};

// --- Main Component ---

export const CoffeeRank = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = React.useState<"list" | "map" | "saved">(
    "list",
  );

  // Scroll-driven header animation
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => ({
    backgroundColor:
      scrollY.value > 20 ? "rgba(244, 237, 214, 0.9)" : "transparent",
    borderBottomWidth: scrollY.value > 20 ? 1 : 0,
    borderBottomColor: "#000000",
  }));

  // Hero star entrance animation
  const heroScale = useSharedValue(0);
  const heroRotate = useSharedValue(-180);

  useEffect(() => {
    heroScale.value = withSpring(1, { stiffness: 260, damping: 90 });
    heroRotate.value = withSpring(0, { stiffness: 260, damping: 90 });
  }, []);

  const heroStarStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: heroScale.value },
      { rotate: `${heroRotate.value}deg` },
    ],
  }));

  return (
    <View style={s.container}>
      {/* Scrollable Content */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: insets.top + 70,
          paddingBottom: 120,
        }}
      >
        {/* Hero Section */}
        <View style={s.heroSection}>
          <Animated.View style={heroStarStyle}>
            <Text style={{ color: "#2E9BC7", fontSize: 90 }}>{"✤"}</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(200)}>
            <Text
              style={[s.heroTitle, {
                fontSize: 44,
                lineHeight: 44,
                letterSpacing: -2,
                maxWidth: 280,
                paddingBottom: 10,
              }]}
            >
              {"Your Coffee List"}
            </Text>
          </Animated.View>
        </View>

        {/* Shop List */}
        <View>
          {COFFEE_SHOPS.map((shop, index) => (
            <ShopItem key={shop.id} shop={shop} index={index} />
          ))}
        </View>

        {/* Load More */}
        <View style={s.loadMoreWrapper}>
          <Pressable
            onPress={() => {}}
            style={({ pressed }) => [
              s.loadMoreButton,
              {
                backgroundColor: pressed ? "#000000" : "transparent",
                gap: 8,
              },
            ]}
          >
            {({ pressed }) => (
              <>
                <Text
                  style={[s.loadMoreText, {
                    fontSize: 12,
                    letterSpacing: 2,
                    color: pressed ? "#F4EDD6" : "#000000",
                  }]}
                >
                  Load 50 More
                </Text>
                <Feather
                  name="chevron-right"
                  size={14}
                  color={pressed ? "#F4EDD6" : "#000000"}
                />
              </>
            )}
          </Pressable>
        </View>
      </Animated.ScrollView>

      {/* Fixed Header */}
      <Animated.View
        style={[headerStyle, s.fixedHeader, { paddingTop: insets.top }]}
      >
        <View style={s.headerRow}>
          <View style={s.headerLeft}>
            <Text
              style={[s.headerLabelText, { fontSize: 0, letterSpacing: 2, opacity: 0.6 }]}
            >
              Location
            </Text>
            <View style={s.headerLocationRow}>
              <Feather name="navigation" size={10} color="#FF3333" />
              <Text style={s.headerValueText}>Berlin, Mitte</Text>
            </View>
          </View>
          <View style={s.headerRight}>
            <Text
              style={[s.headerLabelText, { fontSize: 10, letterSpacing: 2, opacity: 0.6 }]}
            >
              Sorting By
            </Text>
            <View style={s.headerSortRow}>
              <Text style={s.headerValueText}>Rating</Text>
              <Feather name="filter" size={10} color="#000000" />
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Floating Bottom Nav */}
      <View
        style={[s.bottomNavOuter, { bottom: insets.bottom + 16 }]}
      >
        <View
          style={[s.bottomNavInner, { backgroundColor: "#000000", gap: 40, elevation: 10 }]}
        >
          {(
            [
              { key: "list", icon: "list", label: "List" },
              { key: "map", icon: "map", label: "Map" },
              { key: "saved", icon: "bookmark", label: "Saved" },
            ] as const
          ).map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[s.navTab, { gap: 4 }]}
            >
              <Feather
                name={tab.icon}
                size={20}
                color={
                  activeTab === tab.key ? "#D13F2A" : "rgba(244,237,214,0.6)"
                }
              />
              <Text
                style={[s.navTabLabel, {
                  fontSize: 10,
                  letterSpacing: -0.5,
                  color:
                    activeTab === tab.key ? "#D13F2A" : "rgba(244,237,214,0.6)",
                }]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Decorative Star */}
      {/* <View
        style={[s.decorativeStar, { opacity: 0.05 }]}
        pointerEvents="none"
      >
        <Feather name="star" size={200} color="#000000" />
      </View> */}
    </View>
  );
};

// --- Styles ---

const s = StyleSheet.create({
  // RatingShape
  ratingContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
  ratingShapeOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  ratingText: {
    fontWeight: "bold",
    fontSize: 14,
  },

  // ShopItem
  shopItemBase: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  shopItemFirst: {
    borderTopWidth: 1,
    borderTopColor: "#000000",
  },
  shopRank: {
    fontSize: 30,
    fontWeight: "300",
    minWidth: 32,
  },
  shopInfo: {
    flex: 1,
    gap: 4,
  },
  shopName: {
    fontSize: 24,
  },
  shopDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  shopDetailText: {
    fontSize: 14,
  },
  shopSpecialty: {
    fontSize: 14,
    fontStyle: "italic",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#000000",
  },
  shopRight: {
    alignItems: "flex-end",
    gap: 8,
  },

  // CoffeeRank
  container: {
    flex: 1,
    backgroundColor: "#F4EDD6",
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingVertical: 4,
    alignItems: "center",
  },
  heroTitle: {
    textAlign: "center",
  },

  // Load More
  loadMoreWrapper: {
    padding: 32,
    alignItems: "center",
  },
  loadMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#000000",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  loadMoreText: {
    textTransform: "uppercase",
  },

  // Fixed Header
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerLeft: {
    gap: 2,
  },
  headerLabelText: {
    textTransform: "uppercase",
  },
  headerLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headerValueText: {
    fontSize: 14,
    fontWeight: "500",
  },
  headerRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  headerSortRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  // Bottom Nav
  bottomNavOuter: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 50,
  },
  bottomNavInner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 9999,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  navTab: {
    alignItems: "center",
  },
  navTabLabel: {
    fontWeight: "500",
    textTransform: "uppercase",
  },

  // Decorative
  decorativeStar: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 16,
  },
});
