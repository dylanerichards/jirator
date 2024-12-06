class Api::JiraTicketsController < ApplicationController
  def create
    Rails.logger.info "Received ticket params: #{ticket_params.inspect}"
    
    jira_service = JiraService.new
    
    unless ticket_params[:project_key].present?
      Rails.logger.error "Missing project key"
      return render json: { 
        success: false, 
        error: 'Project key is required' 
      }, status: :unprocessable_entity
    end

    Rails.logger.info "Creating JIRA issue with project key: #{ticket_params[:project_key]}"
    response = jira_service.create_issue(ticket_params)
    Rails.logger.info "JIRA API response: #{response.inspect}"

    if response.success?
      render json: { 
        success: true, 
        ticket_key: JSON.parse(response.body)['key']
      }
    else
      error_message = begin
        error_body = JSON.parse(response.body)
        if error_body['errors'].present?
          error_body['errors'].map { |k, v| "#{k}: #{v}" }.join(', ')
        else
          error_body['errorMessages'].first
        end
      rescue => e
        Rails.logger.error "Error parsing JIRA response: #{e.message}"
        'Unknown error occurred'
      end

      Rails.logger.error "JIRA ticket creation failed: #{error_message}"
      render json: { 
        success: false, 
        error: error_message 
      }, status: :unprocessable_entity
    end
  end

  private

  def ticket_params
    params.require(:ticket).permit(
      :summary,
      :description,
      :epic,
      :assignee,
      :labels,
      :project_key
    )
  end
end 