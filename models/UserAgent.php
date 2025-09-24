<?php
/**
 * Created by PhpStorm.
 * User: saloon
 * Date: 11/06/2020
 * Time: 14:11
 */

class UserAgent {
    private $is_mobile;
    private $is_chrome;
    private $is_ios;
    private $is_firefox;
    private $is_android;
    private $is_windows;
    private $is_safari;

    function __construct($is_mobile, $is_chrome, $is_ios, $is_firefox, $is_android, $is_windows, $is_safari)
    {
        $this->is_mobile = $is_mobile;
        $this->is_chrome = $is_chrome;
        $this->is_ios = $is_ios;
        $this->is_firefox = $is_firefox;
        $this->is_android = $is_android;
        $this->is_windows = $is_windows;
        $this->is_safari = $is_safari;
    }

    /**
     * @return mixed
     */
    public function getIsMobile()
    {
        return $this->is_mobile;
    }

    /**
     * @param mixed $is_mobile
     */
    public function setIsMobile($is_mobile)
    {
        $this->is_mobile = $is_mobile;
    }

    /**
     * @return mixed
     */
    public function getIsChrome()
    {
        return $this->is_chrome;
    }

    /**
     * @param mixed $is_chrome
     */
    public function setIsChrome($is_chrome)
    {
        $this->is_chrome = $is_chrome;
    }

    /**
     * @return mixed
     */
    public function getIsIos()
    {
        return $this->is_ios;
    }

    /**
     * @param mixed $is_ios
     */
    public function setIsIos($is_ios)
    {
        $this->is_ios = $is_ios;
    }

    /**
     * @return mixed
     */
    public function getIsFirefox()
    {
        return $this->is_firefox;
    }

    /**
     * @param mixed $is_firefox
     */
    public function setIsFirefox($is_firefox)
    {
        $this->is_firefox = $is_firefox;
    }

    /**
     * @return mixed
     */
    public function getIsAndroid()
    {
        return $this->is_android;
    }

    /**
     * @param mixed $is_android
     */
    public function setIsAndroid($is_android)
    {
        $this->is_android = $is_android;
    }

    /**
     * @return mixed
     */
    public function getIsWindows()
    {
        return $this->is_windows;
    }

    /**
     * @param mixed $is_windows
     */
    public function setIsWindows($is_windows)
    {
        $this->is_windows = $is_windows;
    }

    /**
     * @return mixed
     */
    public function getIsSafari()
    {
        return $this->is_safari;
    }

    /**
     * @param mixed $is_safari
     */
    public function setIsSafari($is_safari)
    {
        $this->is_safari = $is_safari;
    }

}