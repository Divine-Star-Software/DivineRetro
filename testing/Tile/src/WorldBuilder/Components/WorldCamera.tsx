import { TileCamera } from "@divineretro/tile/Camera/TileCamera";
import { useEffect, useState } from "react";

interface WorldCameraProps {
  camera: TileCamera;
}

export const WorldCamera: React.FC<WorldCameraProps> = ({ camera }) => {
  const [x, setX] = useState<number>(camera.position.x);
  const [y, setY] = useState<number>(camera.position.y);

  // State to track which keys are pressed
  const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>({});

  // Update state when camera position changes externally
  useEffect(() => {
    const handleCameraUpdate = () => {
      setX(camera.position.x);
      setY(camera.position.y);
    };

    // Assuming TileCamera has some event emitter or callback mechanism
    // If not, you might need to implement one in TileCamera
    // For simplicity, we'll use a polling mechanism here
    const interval = setInterval(handleCameraUpdate, 100);

    return () => clearInterval(interval);
  }, [camera]);

  // Handle keydown and keyup events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeysPressed((prevKeys) => ({ ...prevKeys, [e.key]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed((prevKeys) => ({ ...prevKeys, [e.key]: false }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Move camera based on pressed keys
  useEffect(() => {
    let animationFrameId: number;
    const speed = 1; // Increase this value to make the camera move faster

    const moveCamera = () => {
    if(!keysPressed["Control"]) return;
      let newX = x;
      let newY = y;

      if (keysPressed["ArrowLeft"]) {
        newX -= speed;
      }
      if (keysPressed["ArrowRight"]) {
        newX += speed;
      }
      if (keysPressed["ArrowUp"]) {
        newY += speed;
      }
      if (keysPressed["ArrowDown"]) {
        newY -= speed;
      }

      if (newX !== x || newY !== y) {
        setX(newX);
        setY(newY);
        camera.setPosition(newX, newY);
      }

      animationFrameId = requestAnimationFrame(moveCamera);
    };

    moveCamera();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [x, y, keysPressed, camera]);

  const handleXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newX = parseFloat(e.target.value) || 0;
    setX(newX);
    camera.setPosition(newX, y);
  };

  const handleYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newY = parseFloat(e.target.value) || 0;
    setY(newY);
    camera.setPosition(x, newY);
  };

  const incrementX = () => {
    const newX = x + 1;
    setX(newX);
    camera.setPosition(newX, y);
  };

  const decrementX = () => {
    const newX = x - 1;
    setX(newX);
    camera.setPosition(newX, y);
  };

  const incrementY = () => {
    const newY = y + 1;
    setY(newY);
    camera.setPosition(x, newY);
  };

  const decrementY = () => {
    const newY = y - 1;
    setY(newY);
    camera.setPosition(x, newY);
  };

  return (
    <>
      <h2 className="section-title">Camera</h2>
      <div className="control-group">
        <label htmlFor="x-position" className="control-label">
          X:
        </label>
        <input
          type="number"
          id="x-position"
          value={x}
          onChange={handleXChange}
          className="control-input"
        />
        <div className="control-buttons">
          <button onClick={decrementX} className="control-button">
            -
          </button>
          <button onClick={incrementX} className="control-button">
            +
          </button>
        </div>
      </div>
      <div className="control-group">
        <label htmlFor="y-position" className="control-label">
          Y:
        </label>
        <input
          type="number"
          id="y-position"
          value={y}
          onChange={handleYChange}
          className="control-input"
        />
        <div className="control-buttons">
          <button onClick={decrementY} className="control-button">
            -
          </button>
          <button onClick={incrementY} className="control-button">
            +
          </button>
        </div>
      </div>
    </>
  );
};
