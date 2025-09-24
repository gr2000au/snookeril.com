<?php
/**
 * Created by PhpStorm.
 * User: saloon
 * Date: 28/05/2020
 * Time: 16:19
 */

class User {
    protected $user_name;
    protected $email;
    protected $full_name;
    protected $team_a_name;
    protected $team_b_name;
    protected $num_of_reds;

    function __construct()
    {
        $this->user_name = '';
        $this->email = '';
        $this->full_name = '';
        $this->team_a_name = '';
        $this->team_b_name = '';
        $this->num_of_reds = '';
    }

    /**
     * @return mixed
     */
    public function getUserName()
    {
        return $this->user_name;
    }

    /**
     * @param mixed $user_name
     */
    public function setUserName($user_name)
    {
        $this->user_name = $user_name;
    }

    /**
     * @return mixed
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @param mixed $email
     */
    public function setEmail($email)
    {
        $this->email = $email;
    }

    /**
     * @return mixed
     */
    public function getFullName()
    {
        return $this->full_name;
    }

    /**
     * @param mixed $full_name
     */
    public function setFullName($full_name)
    {
        $this->full_name = $full_name;
    }

    /**
     * @return mixed
     */
    public function getTeamAName()
    {
        return $this->team_a_name;
    }

    /**
     * @param mixed $team_a_name
     */
    public function setTeamAName($team_a_name)
    {
        $this->team_a_name = $team_a_name;
    }

    /**
     * @return mixed
     */
    public function getTeamBName()
    {
        return $this->team_b_name;
    }

    /**
     * @param mixed $team_b_name
     */
    public function setTeamBName($team_b_name)
    {
        $this->team_b_name = $team_b_name;
    }

    /**
     * @return mixed
     */
    public function getNumOfReds()
    {
        return $this->num_of_reds;
    }

    /**
     * @param mixed $num_of_reds
     */
    public function setNumOfReds($num_of_reds)
    {
        $this->num_of_reds = $num_of_reds;
    }

    public static function fill($obj) {
        $data = new User();
        $data->setUserName($obj->user_name);
        $data->setEmail($obj->email);
        $data->setFullName($obj->full_name);
        $data->setTeamAName($obj->team_a_name);
        $data->setTeamBName($obj->team_b_name);
        $data->setNumOfReds($obj->num_of_reds);
        return $data;
    }
}