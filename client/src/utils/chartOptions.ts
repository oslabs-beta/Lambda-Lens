import { ChartOptions } from "chart.js";

export const getHorizontalBarOptions = (): ChartOptions<"bar"> => ({
  indexAxis: "y" as const,
  scales: {
    x: {
      grid: {
        display: true,
      },
      ticks: {
        color: "#6b7280",
      },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#6b7280",
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#333",
      titleColor: "#fff",
      bodyColor: "#fff",
    },
  },
  maintainAspectRatio: false,
});

export const getDoughnutOptions = (): ChartOptions<"doughnut"> => ({
  plugins: {
    legend: {
      display: true,
      position: "right" as const,
      labels: {
        boxWidth: 12,
        padding: 15,
        color: "#6b7280",
      },
    },
    tooltip: {
      backgroundColor: "#333",
      titleColor: "#fff",
      bodyColor: "#fff",
    },
  },
  maintainAspectRatio: false,
  cutout: "70%",
});

export const getLineOptions = (): ChartOptions<"line"> => ({
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#6b7280",
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
      ticks: {
        color: "#6b7280",
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#333",
      titleColor: "#fff",
      bodyColor: "#fff",
    },
  },
  maintainAspectRatio: false,
});

export const deepMerge = <T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T => {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const sourceValue = source[key as keyof typeof source];
      const targetValue = target[key as keyof typeof target];

      if (isObject(sourceValue)) {
        if (!(key in target)) {
          Object.assign(output, { [key]: sourceValue });
        } else if (isObject(targetValue)) {
          (output as Record<string, unknown>)[key] = deepMerge(
            targetValue as Record<string, unknown>,
            sourceValue as Record<string, unknown>
          );
        } else {
          (output as Record<string, unknown>)[key] = sourceValue;
        }
      } else {
        Object.assign(output, { [key]: sourceValue });
      }
    });
  }

  return output;
};

const isObject = (item: unknown): item is Record<string, unknown> => {
  return Boolean(item && typeof item === "object" && !Array.isArray(item));
};
