import React from "react";
import { useTheme } from "@repo/themes/ThemeProvider";

//ui components
import { Card } from "@repo/utils/Card";

export function ThemePanel({ name, styles }) {
  const { setTheme } = useTheme();

  return (
    <div
      className="duration-300 
          ease-in-out
          hover:scale-105 
          hover:shadow-xl "
      style={{
        backgroundColor: styles["background"],
        borderColor: styles["border"],
      }}
      onClick={() => setTheme(name)}
    >
      <div className="text-center" style={{ color: styles["foreground"] }}>
        <p className="text-sm font-medium">{name}</p>
      </div>

      <Card
        key={name}
        className={`
          p-4 
          flex 
          flex-col 
          items-center 
          justify-center 
        `}
        style={{ backgroundColor: styles["card"] }}
      >
        <div className="row">
          <div style={{ background: styles["primary"] }}>
            {styles["primary"]}
          </div>
          <div style={{ background: styles["secondary"] }}>
            {styles["secondary"]}
          </div>

          {/* <img src="static/images/styling.svg" data-colour="{{value.icons}}" data-name={{key}} class="styling_image"> */}
        </div>
      </Card>
    </div>
  );
}
